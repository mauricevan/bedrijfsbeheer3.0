/**
 * Mock API Server for Dashboard Data
 * Run with: node server/mock-api.js
 * Default port: 3001
 * 
 * Note: This requires express and cors to be installed:
 * npm install express cors
 * 
 * This can be used for development/testing when you want to simulate API calls
 * In production, replace this with real database queries
 */

import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock chat data storage
const mockChats = [];
const mockMessages = new Map(); // chatId -> messages array
const mockUsers = [
  {
    userId: '1',
    name: 'Sophie van Dam',
    email: 'sophie@bedrijf.nl',
    role: 'admin',
    onlineStatus: 'online',
  },
  {
    userId: '2',
    name: 'Jan de Vries',
    email: 'jan@bedrijf.nl',
    role: 'employee',
    onlineStatus: 'online',
  },
  {
    userId: '3',
    name: 'Maria Jansen',
    email: 'maria@bedrijf.nl',
    role: 'employee',
    onlineStatus: 'offline',
  },
  {
    userId: '4',
    name: 'Peter Bakker',
    email: 'peter@bedrijf.nl',
    role: 'employee',
    onlineStatus: 'online',
  },
];

// Helper function to get current user ID from request (simplified for mock)
const getCurrentUserId = (req) => {
  // In a real app, this would come from auth token/session
  // For mock, we'll use query param or default to user 1
  return req.query.userId || req.headers['x-user-id'] || '1';
};

// Mock data generator (matches the structure from the prompt)
function generateMockDashboardData() {
  const now = new Date();
  const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 
    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
  const period = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  // Generate mock sales data (last 6 months)
  const salesByMonth = [];
  const previousYearSales = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
    
    // Current year (slightly increasing trend)
    const baseRevenue = 14000 + (5 - i) * 600 + Math.random() * 1000;
    salesByMonth.push({
      month: monthKey,
      revenue: Math.round(baseRevenue * 100) / 100
    });

    // Previous year (lower baseline)
    const prevYearRevenue = 12000 + (5 - i) * 550 + Math.random() * 800;
    const prevYearDate = new Date(now.getFullYear() - 1, date.getMonth(), 1);
    const prevMonthKey = `${String(prevYearDate.getMonth() + 1).padStart(2, '0')}/${String(prevYearDate.getFullYear()).slice(-2)}`;
    previousYearSales.push({
      month: prevMonthKey,
      revenue: Math.round(prevYearRevenue * 100) / 100
    });
  }

  // Mock payment behavior
  const paymentBehavior = salesByMonth.map(item => ({
    month: item.month,
    onTime: Math.round(item.revenue * 0.85),
    late: Math.round(item.revenue * 0.15)
  }));

  return {
    period,
    comparisonToPrevious: {
      revenueChange: 0.12,
      invoicesChange: -0.05,
      openAmountChange: -0.08,
      quoteConversionChange: 0.09
    },
    stats: {
      totalRevenue: 17660,
      totalInvoiced: 32975,
      openAmount: 15290,
      averagePaymentTermDays: 7,
      openQuotes: 2
    },
    salesByMonth,
    previousYearSales,
    openByCustomer: [
      { name: 'Industrial Partners BV', amount: 8200, daysOpen: 12 },
      { name: 'Metaal Constructies NV', amount: 6800, daysOpen: 21 },
      { name: 'Techbouw BV', amount: 4200, daysOpen: 45 }
    ],
    topCustomers: [
      { name: 'Techbouw BV', revenue: 14000, profit: 4800, trend: 0.1 },
      { name: 'Industrial Partners BV', revenue: 9600, profit: 3100, trend: -0.03 },
      { name: 'Metaal Constructies NV', revenue: 8800, profit: 2900, trend: 0.07 },
      { name: 'AgroTech BV', revenue: 6400, profit: 2400, trend: 0.04 },
      { name: 'Energix Solutions', revenue: 5800, profit: 2000, trend: -0.02 }
    ],
    quotesByStatus: [
      { status: 'Goedgekeurd', count: 4, totalValue: 7800 },
      { status: 'Afgewezen', count: 2, totalValue: 2400 },
      { status: 'In afwachting', count: 3, totalValue: 4200 },
      { status: 'Verlopen', count: 1, totalValue: 1000 }
    ],
    paymentBehavior,
    insights: [
      '💡 Klant Techbouw BV heeft 3 openstaande facturen van €4.200 die gemiddeld 45 dagen oud zijn.',
      '⚠️ Metaal Constructies NV heeft deze maand 21 dagen overschrijding op betalingen.',
      '✅ Omzet steeg met 12% t.o.v. vorige maand — beste maand dit kwartaal.',
      '📈 Conversieratio offertes: 66% (+9% t.o.v. vorige maand).'
    ]
  };
}

// API Endpoints
app.get('/api/dashboard-data', (req, res) => {
  try {
    const data = generateMockDashboardData();
    res.json(data);
  } catch (error) {
    console.error('Error generating dashboard data:', error);
    res.status(500).json({ error: 'Failed to generate dashboard data' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat API Endpoints

// Get all chats for current user
app.get('/api/chat/chats', (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const userChats = mockChats.filter(
      (chat) => chat.participants.some((p) => p.userId === userId)
    );
    res.json(userChats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get messages for a specific chat
app.get('/api/chat/chats/:id/messages', (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const messages = mockMessages.get(id) || [];
    const paginatedMessages = messages.slice(offset, offset + limit);
    res.json(paginatedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Create a new chat
app.post('/api/chat/chats', (req, res) => {
  try {
    const { type, participantIds, name } = req.body;
    const userId = getCurrentUserId(req);
    const chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get participants
    const participants = [
      ...mockUsers.filter((u) => u.userId === userId),
      ...mockUsers.filter((u) => participantIds.includes(u.userId)),
    ].map((u) => ({
      userId: u.userId,
      name: u.name,
      email: u.email,
      role: u.role,
      onlineStatus: u.onlineStatus,
    }));

    const chatName =
      name || (type === 'private' ? participants.find((p) => p.userId !== userId)?.name : 'Groepschat');

    const newChat = {
      id: chatId,
      type,
      name: chatName,
      participants,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockChats.push(newChat);
    mockMessages.set(chatId, []);

    res.status(201).json(newChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Send a message
app.post('/api/chat/chats/:id/messages', (req, res) => {
  try {
    const { id } = req.params;
    const { content, type = 'text' } = req.body;
    const userId = getCurrentUserId(req);
    const user = mockUsers.find((u) => u.userId === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      chatId: id,
      senderId: userId,
      senderName: user.name,
      content,
      timestamp: new Date().toISOString(),
      type,
      readBy: [userId],
    };

    const messages = mockMessages.get(id) || [];
    messages.push(message);
    mockMessages.set(id, messages);

    // Update chat's last message
    const chat = mockChats.find((c) => c.id === id);
    if (chat) {
      chat.lastMessage = message;
      chat.updatedAt = new Date().toISOString();
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get available users
app.get('/api/chat/users', (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const users = mockUsers
      .filter((u) => u.userId !== userId)
      .map((u) => ({
        userId: u.userId,
        name: u.name,
        email: u.email,
        role: u.role,
        onlineStatus: u.onlineStatus,
      }));
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Mark chat as read
app.put('/api/chat/chats/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const userId = getCurrentUserId(req);

    const chat = mockChats.find((c) => c.id === id);
    if (chat) {
      // Mark all messages as read
      const messages = mockMessages.get(id) || [];
      messages.forEach((msg) => {
        if (!msg.readBy.includes(userId)) {
          msg.readBy.push(userId);
        }
      });
      mockMessages.set(id, messages);

      chat.unreadCount = 0;
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Chat not found' });
    }
  } catch (error) {
    console.error('Error marking chat as read:', error);
    res.status(500).json({ error: 'Failed to mark chat as read' });
  }
});

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

// Store connected clients
const clients = new Map(); // userId -> WebSocket

wss.on('connection', (ws, req) => {
  // Extract userId from query string
  const url = new URL(req.url, `http://${req.headers.host}`);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    ws.close(1008, 'User ID required');
    return;
  }

  console.log(`WebSocket client connected: ${userId}`);
  clients.set(userId, ws);

  // Send connection confirmation
  ws.send(
    JSON.stringify({
      type: 'connected',
      payload: { userId },
      timestamp: new Date().toISOString(),
    })
  );

  // Broadcast online status to other users
  broadcastToOthers(userId, {
    type: 'online',
    userId,
    timestamp: new Date().toISOString(),
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      // Handle ping
      if (message.type === 'ping') {
        ws.send(
          JSON.stringify({
            type: 'pong',
            timestamp: new Date().toISOString(),
          })
        );
        return;
      }

      // Handle message
      if (message.type === 'message') {
        const { chatId, content, type } = message.payload;
        const user = mockUsers.find((u) => u.userId === userId);

        if (!user) {
          ws.send(
            JSON.stringify({
              type: 'error',
              payload: { error: 'User not found' },
              timestamp: new Date().toISOString(),
            })
          );
          return;
        }

        const newMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          chatId,
          senderId: userId,
          senderName: user.name,
          content,
          timestamp: new Date().toISOString(),
          type: type || 'text',
          readBy: [userId],
        };

        // Store message
        const messages = mockMessages.get(chatId) || [];
        messages.push(newMessage);
        mockMessages.set(chatId, messages);

        // Update chat's last message
        const chat = mockChats.find((c) => c.id === chatId);
        if (chat) {
          chat.lastMessage = newMessage;
          chat.updatedAt = new Date().toISOString();
          // Increment unread count for other participants
          chat.participants.forEach((p) => {
            if (p.userId !== userId) {
              const participantWs = clients.get(p.userId);
              if (participantWs) {
                chat.unreadCount = (chat.unreadCount || 0) + 1;
              }
            }
          });
        }

        // Broadcast to all participants in the chat
        if (chat) {
          chat.participants.forEach((p) => {
            const participantWs = clients.get(p.userId);
            if (participantWs && participantWs.readyState === 1) {
              participantWs.send(
                JSON.stringify({
                  type: 'message',
                  payload: newMessage,
                  chatId,
                  timestamp: new Date().toISOString(),
                })
              );
            }
          });
        }
      }

      // Handle typing indicator
      if (message.type === 'typing') {
        const { chatId, isTyping } = message.payload;
        const chat = mockChats.find((c) => c.id === chatId);
        if (chat) {
          chat.participants.forEach((p) => {
            if (p.userId !== userId) {
              const participantWs = clients.get(p.userId);
              if (participantWs && participantWs.readyState === 1) {
                participantWs.send(
                  JSON.stringify({
                    type: 'typing',
                    payload: {
                      chatId,
                      userId,
                      userName: mockUsers.find((u) => u.userId === userId)?.name || 'Unknown',
                      isTyping,
                    },
                    timestamp: new Date().toISOString(),
                    chatId,
                  })
                );
              }
            }
          });
        }
      }

      // Handle read receipt
      if (message.type === 'read') {
        const { chatId, messageIds } = message.payload;
        const chat = mockChats.find((c) => c.id === chatId);
        if (chat) {
          const messages = mockMessages.get(chatId) || [];
          messages.forEach((msg) => {
            if (messageIds.includes(msg.id) && !msg.readBy.includes(userId)) {
              msg.readBy.push(userId);
            }
          });
          mockMessages.set(chatId, messages);
          chat.unreadCount = 0;
        }
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      ws.send(
        JSON.stringify({
          type: 'error',
          payload: { error: 'Invalid message format' },
          timestamp: new Date().toISOString(),
        })
      );
    }
  });

  ws.on('close', () => {
    console.log(`WebSocket client disconnected: ${userId}`);
    clients.delete(userId);

    // Broadcast offline status
    broadcastToOthers(userId, {
      type: 'offline',
      userId,
      timestamp: new Date().toISOString(),
    });
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for user ${userId}:`, error);
  });
});

// Helper function to broadcast to all clients except sender
function broadcastToOthers(senderId, message) {
  clients.forEach((ws, userId) => {
    if (userId !== senderId && ws.readyState === 1) {
      ws.send(JSON.stringify(message));
    }
  });
}

server.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard data available at: http://localhost:${PORT}/api/dashboard-data`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat API available at: http://localhost:${PORT}/api/chat/*`);
  console.log(`🔌 WebSocket server available at: ws://localhost:${PORT}/ws`);
});

