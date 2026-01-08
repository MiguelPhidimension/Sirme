import { $ } from "@builder.io/qwik";
import type {
  LoginFormData,
  RegisterFormData,
  User,
  AuthResponse,
} from "~/types";
import { graphqlClient } from "../client";

/**
 * GraphQL Queries and Mutations for Authentication
 */

const GET_USER_BY_EMAIL_QUERY = `
  query GetUserByEmail($email: String!) {
    users(where: { email: { _eq: $email } }) {
      user_id
      role_id
      first_name
      last_name
      email
      password
      created_at
      updated_at
      role {
        role_id
        role_name
        description
      }
    }
  }
`;

const CREATE_USER_MUTATION = `
  mutation CreateUser(
    $first_name: String!
    $last_name: String!
    $email: String!
    $password: String!
    $role_id: uuid!
  ) {
    insert_users_one(object: {
      first_name: $first_name
      last_name: $last_name
      email: $email
      password: $password
      role_id: $role_id
    }) {
      user_id
      role_id
      first_name
      last_name
      email
      created_at
    }
  }
`;

const CHECK_EMAIL_EXISTS_QUERY = `
  query CheckEmailExists($email: String!) {
    users(where: { email: { _eq: $email } }) {
      user_id
    }
  }
`;

/**
 * Simple password hashing (for demo purposes)
 * In production, use bcrypt or similar on the backend
 */
export const hashPassword = $(async (password: string): Promise<string> => {
  // For demo purposes, we'll use a simple hash
  // In production, this should be done on the server with bcrypt
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
});

/**
 * Verify password against hash
 */
export const verifyPassword = $(
  async (password: string, hash: string): Promise<boolean> => {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
  },
);

/**
 * Login user with email and password
 */
export const loginUser = $(
  async (formData: LoginFormData): Promise<AuthResponse> => {
    try {
      // Query user by email
      const response = await graphqlClient.request<{
        users: Array<User & { password: string }>;
      }>(GET_USER_BY_EMAIL_QUERY, { email: formData.email });

      if (!response.users || response.users.length === 0) {
        return {
          success: false,
          message: "Usuario no encontrado",
          errors: ["El email no está registrado"],
        };
      }

      const user = response.users[0];

      // Verify password
      const isValidPassword = await verifyPassword(
        formData.password,
        user.password,
      );

      if (!isValidPassword) {
        return {
          success: false,
          message: "Contraseña incorrecta",
          errors: ["La contraseña no es válida"],
        };
      }

      // Remove password from user object
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      // Generate token (in production, use JWT)
      const token = btoa(
        JSON.stringify({
          user_id: user.user_id,
          email: user.email,
          timestamp: Date.now(),
        }),
      );

      return {
        success: true,
        user: userWithoutPassword,
        token,
        message: "Login exitoso",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Error en el servidor",
        errors: ["No se pudo completar el login. Intente nuevamente."],
      };
    }
  },
);

/**
 * Register new user
 */
export const registerUser = $(
  async (formData: RegisterFormData): Promise<AuthResponse> => {
    try {
      // Validate required fields
      if (
        !formData.first_name ||
        !formData.last_name ||
        !formData.email ||
        !formData.password ||
        !formData.role_id
      ) {
        return {
          success: false,
          message: "Campos requeridos faltantes",
          errors: ["Por favor completa todos los campos requeridos"],
        };
      }

      // Check if email already exists
      const existingUser = await graphqlClient.request<{
        users: Array<{ user_id: string }>;
      }>(CHECK_EMAIL_EXISTS_QUERY, { email: formData.email });

      if (existingUser.users && existingUser.users.length > 0) {
        return {
          success: false,
          message: "Email ya registrado",
          errors: ["Este email ya está en uso"],
        };
      }

      // Validate password match
      if (formData.password !== formData.confirm_password) {
        return {
          success: false,
          message: "Las contraseñas no coinciden",
          errors: ["Las contraseñas deben ser iguales"],
        };
      }

      // Validate password strength
      if (formData.password.length < 6) {
        return {
          success: false,
          message: "Contraseña muy débil",
          errors: ["La contraseña debe tener al menos 6 caracteres"],
        };
      }

      // Hash password
      const hashedPassword = await hashPassword(formData.password);

      // Create user
      const response = await graphqlClient.request<{ insert_users_one: User }>(
        CREATE_USER_MUTATION,
        {
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: hashedPassword,
          role_id: formData.role_id,
        },
      );

      const user = response.insert_users_one;

      if (!user) {
        return {
          success: false,
          message: "Error al crear usuario",
          errors: ["No se pudo crear el usuario. Intente nuevamente."],
        };
      }

      // Generate token
      const token = btoa(
        JSON.stringify({
          user_id: user.user_id,
          email: user.email,
          timestamp: Date.now(),
        }),
      );

      return {
        success: true,
        user,
        token,
        message: "Registro exitoso",
      };
    } catch (error: any) {
      console.error("Register error:", error);

      // Handle specific GraphQL errors
      if (error?.response?.errors) {
        const errorMessages = error.response.errors.map((e: any) => e.message);
        return {
          success: false,
          message: "Error en el servidor",
          errors: errorMessages,
        };
      }

      return {
        success: false,
        message: "Error en el servidor",
        errors: [
          "No se pudo completar el registro. Verifique su conexión e intente nuevamente.",
        ],
      };
    }
  },
);

/**
 * Logout user
 */
export const logoutUser = $(() => {
  // Clear session storage
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
  }
});

/**
 * Get current user from session
 */
export const getCurrentUser = $((): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const userStr = sessionStorage.getItem("auth_user");
    if (!userStr) return null;
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
});

/**
 * Save user session
 */
export const saveUserSession = $((user: User, token: string) => {
  if (typeof window === "undefined") return;

  sessionStorage.setItem("auth_token", token);
  sessionStorage.setItem("auth_user", JSON.stringify(user));
});
