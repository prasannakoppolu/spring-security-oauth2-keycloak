#!/bin/bash

echo "🚀 Setting up E-Commerce Platform Development Environment"
echo "========================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17+ first."
    exit 1
fi

echo "✅ Prerequisites check passed!"
echo ""

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/.mvn/wrapper
mkdir -p frontend/public
mkdir -p k8s
mkdir -p nginx

echo "✅ Directories created!"
echo ""

# Set execute permissions
echo "🔧 Setting execute permissions..."
chmod +x backend/mvnw
chmod +x setup.sh

echo "✅ Permissions set!"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
if [ -f package.json ]; then
    npm install
    echo "✅ Frontend dependencies installed!"
else
    echo "❌ package.json not found in frontend directory"
fi
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. For local development with Docker:"
echo "   docker-compose up --build"
echo ""
echo "2. For local development without Docker:"
echo "   - Start Couchbase: docker run -d --name couchbase -p 8091-8093:8091-8093 -p 11210:11210 couchbase:community-7.2.0"
echo "   - Start backend: cd backend && ./mvnw spring-boot:run"
echo "   - Start frontend: cd frontend && npm start"
echo ""
echo "3. For Kubernetes deployment:"
echo "   kubectl apply -f k8s/"
echo ""
echo "📝 Important URLs:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8080"
echo "   - Couchbase Admin: http://localhost:8091"
echo ""
echo "📚 Documentation: See README.md for detailed instructions"