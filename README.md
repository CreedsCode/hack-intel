warning ai generated and not have been going through review.
# HackVision Analytics 🚀

Real-time analytics dashboard for blockchain hackathons, powered by Blockscout's battle-tested indexer infrastructure.

## Quick Start (5 minutes) 🏃‍♂️

```bash
# Clone the repository
git clone https://github.com/CreedsCode/hack-intel
cd hack-intel

# Copy environment file
cp .env.example .env

# Start all services
docker compose up -d

# Access the dashboard
open http://localhost
```

## Detailed Setup Guide 🛠️

### Prerequisites

- Docker Engine 24.0.0+
- Docker Compose v2.20.0+
- Git
- Node.js 18+ (for local development)

### Step-by-Step Setup

1. **Clone & Configure**
   ```bash
   # Clone the repository
   git clone https://github.com/your-org/hackvision-analytics
   cd hackvision-analytics
   
   # Copy environment configuration
   cp .env.example .env
   
   # Edit .env with your Blockscout API key
   nano .env
   ```

2. **Start Services**
   ```bash
   # Build and start all services
   docker compose up -d
   
   # Check service status
   docker compose ps
   
   # View logs (optional)
   docker compose logs -f
   ```

3. **Access Applications**
   - Dashboard: http://localhost
   - Cube.js Playground: http://localhost:4000

4. **Development Setup (Optional)**
   ```bash
   # Install frontend dependencies
   cd frontend
   pnpm install
   
   # Start development server
   pnpm dev
   ```

## Architecture Overview 🏗️

HackVision Analytics is a modern monorepo built with scalability and developer experience in mind:

### Core Services

#### 1. Frontend (React + Vite)
- Modern React application with TypeScript
- Real-time data visualization with Chart.js
- Tailwind CSS for responsive design
- Vite for lightning-fast builds

#### 2. Cube.js Analytics Engine
Cube.js serves as our analytics backbone, offering:
- **Pre-aggregations**: Automatic materialization of frequently used queries
- **Real-time Analytics**: WebSocket support for live updates
- **SQL Query Generation**: Write analytics in JavaScript, execute as optimized SQL
- **Caching & Performance**: Multi-level caching system
- **API Flexibility**: REST, GraphQL, and WebSocket endpoints
- **Security**: Row-level security and access control

#### 3. PostgreSQL Database
- Stores blockchain transaction data
- Optimized for analytics workloads
- Automatic data import from Blockscout

#### 4. Data Import Service
- Connects to Blockscout's API
- Processes and normalizes blockchain data
- Handles incremental updates

### Data Flow

```mermaid
graph LR
    A[Blockscout API] --> B[Import Service]
    B --> C[PostgreSQL]
    C --> D[Cube.js]
    D --> E[Frontend]
```

### Key Features

1. **Real-time Analytics**
   - Live transaction monitoring
   - WebSocket updates
   - Automatic data refresh

2. **Developer Experience**
   - Hot module replacement
   - TypeScript support
   - Comprehensive documentation
   - Docker-based development

3. **Customization**
   - Custom metrics and dimensions
   - Pluggable data sources
   - Extensible dashboard components
   - Themeable UI

4. **Performance**
   - Optimized database queries
   - Automatic query caching
   - Pre-aggregated results
   - Compressed responses

## Configuration Guide 📝

### Environment Variables

```bash
# Frontend Configuration
VITE_APP_TITLE=HackVision Analytics
VITE_CUBE_API_URL=http://localhost:4000
VITE_API_BASE_URL=http://localhost:4000
PORT=80

# Cube.js Configuration
CUBEJS_PORT=4000
CUBEJS_API_SECRET=your-secret-key
CUBEJS_DEV_MODE=true

# Blockscout Configuration
BLOCKSCOUT_API_URL=https://rootstock-testnet.blockscout.com/api/v2/transactions
BLOCKSCOUT_API_KEY=your-blockscout-api-key
```

> 💡 **Pro Tip**: If you're running your own Blockscout instance (which is common for hackathon organizers), make sure to configure an admin API key in your instance's configuration. This gives you unlimited access to your own API endpoints without rate limiting. Check Blockscout's documentation on setting up API keys in your instance's configuration files.

### Custom Metrics

Cube.js makes it easy to add custom metrics. Example:

```