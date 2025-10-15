'use client';
import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';

export default function ChatbotPage() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your AI assistant powered by Cloudflare Workers AI. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Display the error message from the API
                const errorMessage = data.message || data.error || 'Failed to get response';
                throw new Error(errorMessage);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        } catch (error) {
            console.error('Error:', error);

            // Display helpful error message
            let errorContent = 'Sorry, I encountered an error. ';

            if (error.message.includes('AI binding not available')) {
                errorContent = '⚠️ AI features are not available in local development mode.\n\n' +
                    'To test the chatbot:\n' +
                    '1. Build: npm run pages:build\n' +
                    '2. Run locally: npx wrangler pages dev .next-deploy --compatibility-date=2025-01-01 --binding AI\n\n' +
                    'Or deploy to Cloudflare Pages for full functionality.';
            } else if (error.message) {
                errorContent += error.message;
            } else {
                errorContent += 'Please try again.';
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorContent
            }]);
        } finally {
            setLoading(false);
        }
    };

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
                            <FaRobot size={24} />
                            AI Assistant
                        </h2>
                        <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
                            Powered by Cloudflare Workers AI
                        </p>
                    </div>

                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '20px',
                        background: '#f8f9fa'
                    }}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                                    marginBottom: '15px'
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '70%',
                                        padding: '12px 16px',
                                        borderRadius: '16px',
                                        background: message.role === 'user'
                                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                            : 'white',
                                        color: message.role === 'user' ? 'white' : '#333',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px'
                                    }}
                                >
                                    <div style={{ marginTop: '2px' }}>
                                        {message.role === 'user' ? (
                                            <FaUser size={16} />
                                        ) : (
                                            <FaRobot size={16} style={{ color: '#667eea' }} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1, wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
                                <div
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '16px',
                                        background: 'white',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <FaRobot size={16} style={{ color: '#667eea' }} />
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <span className="typing-dot" style={{ animationDelay: '0s' }}></span>
                                        <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
                                        <span className="typing-dot" style={{ animationDelay: '0.4s' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{
                        padding: '20px',
                        borderTop: '1px solid #e0e0e0',
                        background: 'white'
                    }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                disabled={loading}
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
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
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
                                {loading ? 'Sending...' : (
                                    <>
                                        <FaPaperPlane size={14} />
                                        Send
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

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
        </>
    );
}
