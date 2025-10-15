'use client';
import { useEffect, useState } from 'react';
import Ably from 'ably';

export default function PushNotifications() {
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [inAppNotifications, setInAppNotifications] = useState([]);

    useEffect(() => {
        console.log('[PushNotifications] Component mounted');
        // Check if browser supports notifications
        if ('Notification' in window) {
            console.log('[PushNotifications] Browser supports notifications');
            setNotificationPermission(Notification.permission);
        } else {
            console.error('[PushNotifications] Browser does NOT support notifications');
        }
    }, []);

    useEffect(() => {
        console.log('[PushNotifications] Permission changed:', notificationPermission);
        // Initialize Ably connection and subscribe to student updates
        if (notificationPermission === 'granted') {
            console.log('[PushNotifications] Permission granted, initializing Ably...');
            initializeAblySubscription();
        }

        return () => {
            // Cleanup on unmount
            if (window.ablyClient) {
                console.log('[PushNotifications] Closing Ably client');
                window.ablyClient.close();
            }
        };
    }, [notificationPermission]);

    const requestNotificationPermission = async () => {
        console.log('[PushNotifications] Request permission clicked');
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notifications');
            return;
        }

        try {
            console.log('[PushNotifications] Requesting permission...');
            const permission = await Notification.requestPermission();
            console.log('[PushNotifications] Permission result:', permission);
            setNotificationPermission(permission);

            if (permission === 'granted') {
                console.log('[PushNotifications] Permission granted, showing test notification');
                showNotification('Notifications Enabled', 'You will now receive student updates');
            }
        } catch (error) {
            console.error('[PushNotifications] Error requesting notification permission:', error);
        }
    };

    const initializeAblySubscription = async () => {
        try {
            console.log('[Ably] Fetching auth token from /api/ably-token...');

            // Initialize Ably client with token request
            const client = new Ably.Realtime({
                authUrl: '/api/ably-token',
                log: { level: 4 }, // Enable verbose logging
                autoConnect: true,
                echoMessages: false // Don't receive our own messages
            });

            window.ablyClient = client;

            // Monitor connection state
            client.connection.on('connecting', () => {
                console.log('[Ably] Connecting...');
                setConnectionStatus('connecting');
            });

            // Wait for connection before subscribing
            const setupChannel = async () => {
                // Wait for connection to be ready
                await new Promise((resolve) => {
                    if (client.connection.state === 'connected') {
                        resolve();
                    } else {
                        client.connection.once('connected', resolve);
                    }
                });

                console.log('[Ably] Connection ready, setting up channel...');

                // Subscribe to students channel
                const channel = client.channels.get('students');

                console.log('[Ably] Subscribing to students channel...');
                console.log('[Ably] Channel name:', channel.name);
                console.log('[Ably] Channel state:', channel.state);

                // Monitor channel state
                channel.on('attached', () => {
                    console.log('[Ably Channel] ✅ Attached to channel successfully');
                });

                channel.on('failed', (err) => {
                    console.error('[Ably Channel] ❌ Failed to attach:', err);
                });

                // ALSO subscribe to ALL messages for debugging
                channel.subscribe((message) => {
                    console.log('[Ably DEBUG] 🔥 Received ANY message:', message);
                    console.log('[Ably DEBUG] Message name:', message.name);
                    console.log('[Ably DEBUG] Message data:', message.data);
                });

                // Subscribe to specific event name 'student-update'
                channel.subscribe('student-update', (message) => {
                    console.log('[Ably] ✅ Received student-update message:', message);
                    console.log('[Ably] Message name:', message.name);
                    console.log('[Ably] Message data:', JSON.stringify(message.data, null, 2));

                    // Alert to make it obvious
                    console.log('🔔🔔🔔 NOTIFICATION RECEIVED! Processing now...');

                    try {
                        const { action, student, timestamp } = message.data;

                        if (!action || !student) {
                            console.error('[Ably] Invalid message format - missing action or student:', message.data);
                            return;
                        }

                        const studentName = student.firstName && student.lastName
                            ? `${student.firstName} ${student.lastName}`
                            : student.name || 'Student';

                        console.log('[Ably] Processing action:', action, 'for student:', studentName);

                        let title, body, icon;

                        switch (action) {
                            case 'student.created':
                                title = 'New Student Added';
                                body = `${studentName} has been added to the system`;
                                icon = '✅';
                                break;
                            case 'student.updated':
                                title = 'Student Updated';
                                body = `${studentName}'s information has been updated`;
                                icon = '✏️';
                                break;
                            case 'student.deleted':
                                title = 'Student Removed';
                                body = `${studentName} has been removed from the system`;
                                icon = '❌';
                                break;
                            default:
                                title = 'Student Notification';
                                body = `A change occurred for ${studentName}`;
                                icon = 'ℹ️';
                        }

                        console.log('[Ably] Showing notification:', title, body);
                        showNotification(title, body, icon, student.id || student.studentId);

                        // Also show in-app notification
                        showInAppNotification(title, body, action);
                    } catch (error) {
                        console.error('[Ably] Error processing message:', error);
                    }
                });

                setIsSubscribed(true);
                console.log('[Ably] ✅ Successfully subscribed to student notifications');
            };

            client.connection.on('connected', () => {
                console.log('[Ably] Connected successfully!');
                console.log('[Ably] Connection ID:', client.connection.id);
                console.log('[Ably] Connection key:', client.connection.key);
                setConnectionStatus('connected');
            });

            client.connection.on('disconnected', () => {
                console.log('[Ably] Disconnected');
                setConnectionStatus('disconnected');
            });

            client.connection.on('failed', (error) => {
                console.error('[Ably] Connection failed:', error);
                setConnectionStatus('failed');
            });

            client.connection.on('suspended', () => {
                console.warn('[Ably] Connection suspended');
                setConnectionStatus('suspended');
            });

            // Start channel setup
            setupChannel().catch(error => {
                console.error('[Ably] Error setting up channel:', error);
                setConnectionStatus('error');
            });
        } catch (error) {
            console.error('[Ably] ❌ Failed to initialize subscription:', error);
            console.error('[Ably] Error details:', error.message, error.stack);
            setConnectionStatus('error');
        }
    };

    const showInAppNotification = (title, body, action) => {
        const notifId = Date.now();
        const newNotif = {
            id: notifId,
            title,
            body,
            action,
            timestamp: new Date()
        };

        setInAppNotifications(prev => [...prev, newNotif]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            setInAppNotifications(prev => prev.filter(n => n.id !== notifId));
        }, 5000);
    };

    const removeInAppNotification = (id) => {
        setInAppNotifications(prev => prev.filter(n => n.id !== id));
    };

    const showNotification = (title, body, icon = '🔔', studentId = null) => {
        console.log('[Notification] Attempting to show:', title);
        console.log('[Notification] Current permission:', Notification.permission);

        if (Notification.permission === 'granted') {
            try {
                console.log('[Notification] Creating notification...');
                const notification = new Notification(title, {
                    body: body,
                    icon: '/icon.png',
                    badge: '/badge.png',
                    tag: studentId ? `student-${studentId}` : 'student-notification',
                    requireInteraction: false,
                    silent: false
                });

                console.log('[Notification] ✅ Notification created successfully');

                notification.onclick = () => {
                    console.log('[Notification] Notification clicked');
                    window.focus();
                    if (studentId) {
                        window.location.href = `/students/${studentId}`;
                    }
                    notification.close();
                };

                // Auto-close after 5 seconds
                setTimeout(() => {
                    notification.close();
                }, 5000);
            } catch (error) {
                console.error('[Notification] ❌ Error creating notification:', error);
            }
        } else {
            console.warn('[Notification] ⚠️ Permission not granted:', Notification.permission);
        }
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'student.created': return '✅';
            case 'student.updated': return '✏️';
            case 'student.deleted': return '❌';
            default: return '🔔';
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'student.created': return 'rgba(76, 175, 80, 0.95)';
            case 'student.updated': return 'rgba(33, 150, 243, 0.95)';
            case 'student.deleted': return 'rgba(244, 67, 54, 0.95)';
            default: return 'rgba(102, 126, 234, 0.95)';
        }
    };

    return (
        <>
            {/* In-app notifications */}
            <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
                {inAppNotifications.map((notif) => (
                    <div
                        key={notif.id}
                        style={{
                            background: getActionColor(notif.action),
                            color: 'white',
                            borderRadius: '12px',
                            padding: '16px 20px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            animation: 'slideInRight 0.3s ease-out',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        <div style={{ fontSize: '24px' }}>{getActionIcon(notif.action)}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>
                                {notif.title}
                            </div>
                            <div style={{ fontSize: '13px', opacity: 0.95 }}>
                                {notif.body}
                            </div>
                        </div>
                        <button
                            onClick={() => removeInAppNotification(notif.id)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '16px',
                                padding: 0
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {/* Control panel */}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
                {notificationPermission === 'default' && (
                    <button
                        onClick={requestNotificationPermission}
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            padding: '12px 24px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                        }}
                    >
                        🔔 Enable Notifications
                    </button>
                )}

                {notificationPermission === 'granted' && isSubscribed && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div
                            style={{
                                background: 'rgba(76, 175, 80, 0.9)',
                                color: 'white',
                                borderRadius: '50px',
                                padding: '12px 24px',
                                fontSize: '14px',
                                fontWeight: '600',
                                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            ✅ Notifications Active ({connectionStatus})
                        </div>
                        <button
                            onClick={() => {
                                showNotification('Test Notification', 'This is a test notification');
                                showInAppNotification('Test Notification', 'This is a test notification', 'test');
                            }}
                            style={{
                                background: 'rgba(102, 126, 234, 0.9)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                padding: '8px 16px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 2px 10px rgba(102, 126, 234, 0.4)'
                            }}
                        >
                            Test Notification
                        </button>
                    </div>
                )}

                {notificationPermission === 'denied' && (
                    <div
                        style={{
                            background: 'rgba(244, 67, 54, 0.9)',
                            color: 'white',
                            borderRadius: '50px',
                            padding: '12px 24px',
                            fontSize: '14px',
                            fontWeight: '600',
                            boxShadow: '0 4px 15px rgba(244, 67, 54, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        🔕 Notifications Blocked
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </>
    );
}
