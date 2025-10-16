'use client';
import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FaUser, FaPaperPlane } from 'react-icons/fa';
import { Realtime } from 'ably';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [isUsernameSet, setIsUsernameSet] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [ablyClient, setAblyClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize Ably when username is set
    useEffect(() => {
        if (!isUsernameSet || !username) return;

        let client = null;
        let chatChannel = null;

        const initializeAbly = async () => {
            try {
                console.log('[Chat] Fetching Ably token for user:', username);

                // Initialize Ably client with token
                client = new Realtime({
                    authCallback: async (tokenParams, callback) => {
                        try {
                            console.log('[Chat] Auth callback - fetching token for:', username);
                            const res = await fetch(`/api/ably-token?clientId=${encodeURIComponent(username)}`);
                            if (!res.ok) {
                                throw new Error('Failed to get Ably token');
                            }
                            const data = await res.json();
                            console.log('[Chat] Token received for clientId:', data.clientId);
                            callback(null, data);
                        } catch (err) {
                            console.error('[Chat] Auth callback error:', err);
                            callback(err, null);
                        }
                    },
                });

                // Set up connection event handlers
                client.connection.on('connected', () => {
                    console.log('[Chat] ✅ Connected to Ably');
                });

                client.connection.on('failed', (error) => {
                    console.error('[Chat] ❌ Connection failed:', error);
                });

                // Get the chat channel
                chatChannel = client.channels.get('chat-room');

                // Subscribe to messages
                chatChannel.subscribe('message', (message) => {
                    console.log('[Chat] Received message:', message.data);
                    setMessages(prev => [...prev, message.data]);
                });

                // Subscribe to typing indicators
                chatChannel.subscribe('typing', (message) => {
                    const { username: typingUser, isTyping } = message.data;
                    console.log('[Chat] Typing indicator received:', typingUser, isTyping, 'Current user:', username);

                    // Don't show typing indicator for yourself
                    if (typingUser === username) {
                        console.log('[Chat] Ignoring own typing indicator');
                        return;
                    }

                    setTypingUsers(prev => {
                        if (isTyping) {
                            // Add user to typing list if not already there
                            if (!prev.includes(typingUser)) {
                                console.log('[Chat] Adding to typing list:', typingUser);
                                return [...prev, typingUser];
                            }
                            return prev;
                        } else {
                            // Remove user from typing list
                            console.log('[Chat] Removing from typing list:', typingUser);
                            return prev.filter(u => u !== typingUser);
                        }
                    });
                });

                setAblyClient(client);
                setChannel(chatChannel);

                console.log('[Chat] ✅ Ably initialized successfully');
            } catch (error) {
                console.error('[Chat] Failed to initialize Ably:', error);
            }
        };

        initializeAbly();

        // Cleanup on unmount
        return () => {
            if (client) {
                console.log('[Chat] Disconnecting from Ably...');
                client.close();
            }
        };
    }, [isUsernameSet, username]);

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            setIsUsernameSet(true);
        }
    };

    const sendTypingIndicator = (isTyping) => {
        if (channel && username) {
            console.log('[Chat] Sending typing indicator:', username, isTyping);
            channel.publish('typing', {
                username,
                isTyping,
            });
        } else {
            console.log('[Chat] Cannot send typing indicator - channel:', !!channel, 'username:', !!username);
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);

        // Send typing indicator
        sendTypingIndicator(true);

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing indicator after 2 seconds of no input
        typingTimeoutRef.current = setTimeout(() => {
            sendTypingIndicator(false);
        }, 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || !channel) return;

        const messageText = input.trim();
        setInput('');

        // Stop typing indicator
        sendTypingIndicator(false);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Publish message to Ably
        const messageData = {
            username,
            text: messageText,
            timestamp: new Date().toISOString(),
        };

        try {
            await channel.publish('message', messageData);
            console.log('[Chat] Message sent:', messageData);
        } catch (error) {
            console.error('[Chat] Failed to send message:', error);
        }
    };

    // Username input screen
    if (!isUsernameSet) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ maxWidth: '600px', marginTop: '100px' }}>
                    <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '20px', color: '#667eea' }}>Join Chat Room</h2>
                        <p style={{ marginBottom: '30px', color: '#666' }}>
                            Enter your name to start chatting
                        </p>
                        <form onSubmit={handleUsernameSubmit}>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Your name (e.g., Maha)"
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    fontSize: '16px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    marginBottom: '20px',
                                    outline: 'none',
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={!username.trim()}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    fontSize: '16px',
                                }}
                            >
                                Join Chat
                            </button>
                        </form>
                    </div>
                </div>
            </>
        );
    }

    // Get typing indicator text
    const getTypingText = () => {
        if (typingUsers.length === 0) return '';
        if (typingUsers.length === 1) return `${typingUsers[0]} is typing...`;
        if (typingUsers.length === 2) return `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
        return `${typingUsers[0]}, ${typingUsers[1]} and ${typingUsers.length - 2} others are typing...`;
    };

    // Chat screen
    return (
        <>
            <Navbar />
            <div className="container" style={{ maxWidth: '900px', marginTop: '40px' }}>
                <div className="card" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        padding: '20px',
                        borderBottom: '1px solid #e0e0e0',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: '12px 12px 0 0'
                    }}>
                        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            Chat Room
                        </h2>
                        <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
                            Logged in as: <strong>{username}</strong>
                        </p>
                    </div>

                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '20px',
                        background: '#f8f9fa'
                    }}>
                        {messages.length === 0 && (
                            <div style={{
                                textAlign: 'center',
                                color: '#999',
                                padding: '40px 20px',
                            }}>
                                No messages yet. Start the conversation!
                            </div>
                        )}

                        {messages.map((message, index) => {
                            const isOwnMessage = message.username === username;
                            return (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                        marginBottom: '15px'
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: '70%',
                                            padding: '12px 16px',
                                            borderRadius: '16px',
                                            background: isOwnMessage
                                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                : 'white',
                                            color: isOwnMessage ? 'white' : '#333',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        {!isOwnMessage && (
                                            <div style={{
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                marginBottom: '4px',
                                                color: isOwnMessage ? 'rgba(255,255,255,0.9)' : '#667eea'
                                            }}>
                                                {message.username}
                                            </div>
                                        )}
                                        <div style={{ wordWrap: 'break-word' }}>
                                            {message.text}
                                        </div>
                                        <div style={{
                                            fontSize: '10px',
                                            opacity: 0.7,
                                            marginTop: '4px',
                                            textAlign: 'right'
                                        }}>
                                            {new Date(message.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Typing indicator */}
                    {typingUsers.length > 0 && (
                        <div style={{
                            padding: '10px 20px',
                            fontSize: '14px',
                            color: '#667eea',
                            fontStyle: 'italic',
                            background: '#f0f4ff',
                            borderTop: '1px solid #667eea',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <span className="typing-dot" style={{ animationDelay: '0s' }}></span>
                                <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
                                <span className="typing-dot" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                            <span>{getTypingText()}</span>
                        </div>
                    )}

                    <style jsx>{`
                        @keyframes typing {
                            0%, 60%, 100% {
                                transform: translateY(0);
                                opacity: 0.7;
                            }
                            30% {
                                transform: translateY(-10px);
                                opacity: 1;
                            }
                        }
                        .typing-dot {
                            display: inline-block;
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background-color: #667eea;
                            animation: typing 1.4s infinite;
                        }
                    `}</style>

                    <div style={{
                        padding: '20px',
                        borderTop: '1px solid #e0e0e0',
                        background: 'white'
                    }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Type your message..."
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '24px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    // Stop typing indicator when unfocused
                                    sendTypingIndicator(false);
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="btn btn-primary"
                                style={{
                                    borderRadius: '24px',
                                    padding: '12px 24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    minWidth: '100px',
                                    justifyContent: 'center'
                                }}
                            >
                                <FaPaperPlane size={14} />
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
