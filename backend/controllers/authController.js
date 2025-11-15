// Authentication controller
import bcrypt from 'bcrypt';
import prisma from '../config/database.js';
import { generateToken } from '../utils/jwt.js';

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Email, wachtwoord en naam zijn verplicht',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Wachtwoord moet minimaal 8 tekens zijn',
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Dit email adres is al geregistreerd',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        isAdmin: false, // First user should be manually set to admin in DB
      },
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email en wachtwoord zijn verplicht',
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Ongeldige inloggegevens',
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({
        error: 'Ongeldige inloggegevens',
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'Gebruiker niet gevonden',
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout (client-side token removal, just returns success)
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  // JWT is stateless, so logout is handled client-side
  // This endpoint exists for consistency
  res.json({
    message: 'Succesvol uitgelogd',
  });
};
