# Health4travel admin platform

Welcome to the Health4travel admin platform. Below you will find information on how to run the platform, how to contribute and more.

## Contribution

We follow a clone-based contribution model.

This means you need to:

1. Clone the repository.
2. Create a branch in your clone repository.
3. Push your work to the branch in your cloned repository.
4. Create a pull request to the current milestone main branch.

All tests, including linting and static code analysis, will also run in your cloned repository.

## Running the platform

Install the relevant packages using the following command:

```bash
npm install
```

To run the development server, you can use the following command:

```bash
npm start
```

## Project Structure

```bash
.
└── H4T-CUSTOMER-FE-WEBAPP/
    └── src/                        # Main source directory
        ├── /assets                 # Static assets like images, icons, fonts, etc.           
        ├── /components             # Reusable UI components used across the app
        ├── /constants              # Application-wide constants and configuration variables
        ├── /context                # React context definitions for global state management
        ├── /helpers                # Helper functions for various utility purposes
        ├── /hoc                    # Higher-order components for extending component functionality
        ├── /hooks                  # Custom React hooks for managing state and effects
        ├── /interfaces             # TypeScript interfaces and types
        ├── /locales                # Localization files for supporting multiple languages
        ├── /routes                 # Route definitions and configuration for the app
        ├── /screens                # Page-level components or screens representing different views
        ├── /services               # API service files for handling HTTP requests
        ├── /types                  # Type definitions for TypeScript (models, global types, etc.)
        ├── /utils                  # Utility functions used across the application
        ├── App.css                 # Global CSS for the main application
        ├── App.test.tsx            # Test file for the main App component
        ├── App.tsx                 # Root component of the application
        ├── index.css               # Global styles applied to the app
        ├── index.tsx               # Main entry point for React rendering
        ├── react-app-env.d.ts      # Environment type definitions for TypeScript
        ├── reportWebVitals.ts      # Performance measurement functions 
        └── setupTests.ts           # Jest setup file for configuring testing environment
```

## Root Files

- `.env` - Environment configuration file.
- `dev.env` - Development-specific environment configuration.
- `prod.env` - Production-specific environment configuration.
- `.gitignore` - Specifies which files and directories to ignore in version control.
- `package-lock.json` - Locked versions of dependencies for consistency.
- `package.json` - Lists project metadata and dependencies.

## Conventions

Filenames should follow the conventions for the language they are written in. For example, 
1. Folders should be named in `kebab-case`.
2. Any JSX/TSX files should be named with `CamelCase.tsx`.
3. Any JS/TS files should be named with `camelCase.ts`.
4. Use [ant.design](https://ant.design/) for layout and styling.