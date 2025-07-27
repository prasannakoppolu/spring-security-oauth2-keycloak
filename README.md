# E-Commerce Platform

A modern, full-stack e-commerce platform built with React, Spring Boot, Couchbase, and deployed on Kubernetes with Jenkins CI/CD.

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript, Material-UI, Redux Toolkit
- **Backend**: Spring Boot 3.2, Spring Security, JWT Authentication
- **Database**: Couchbase NoSQL Database
- **Deployment**: Kubernetes with Docker containers
- **CI/CD**: Jenkins with automated testing and deployment
- **Monitoring**: Spring Actuator for health checks

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  Spring Boot    │    │   Couchbase     │
│   (Frontend)    │◄──►│    (Backend)    │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ - Material-UI   │    │ - REST API      │    │ - NoSQL         │
│ - Redux         │    │ - JWT Auth      │    │ - N1QL Queries  │
│ - TypeScript    │    │ - Spring Data   │    │ - JSON Docs     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Kubernetes    │
                    │    Cluster      │
                    │                 │
                    │ - Pods          │
                    │ - Services      │
                    │ - Ingress       │
                    │ - Secrets       │
                    └─────────────────┘
```

## 📁 Project Structure

```
├── backend/                    # Spring Boot Application
│   ├── src/main/java/
│   │   └── com/ecommerce/
│   │       ├── controller/     # REST Controllers
│   │       ├── model/          # Entity Models
│   │       ├── repository/     # Data Repositories
│   │       ├── security/       # Security & JWT
│   │       ├── dto/            # Data Transfer Objects
│   │       └── service/        # Business Logic
│   ├── src/main/resources/
│   │   └── application.yml     # Configuration
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # React Application
│   ├── src/
│   │   ├── components/         # Reusable Components
│   │   ├── pages/              # Page Components
│   │   ├── store/              # Redux Store
│   │   │   └── slices/         # Redux Slices
│   │   └── services/           # API Services
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── k8s/                        # Kubernetes Manifests
│   ├── namespace.yaml
│   ├── couchbase-deployment.yaml
│   ├── backend-deployment.yaml
│   └── frontend-deployment.yaml
├── docker-compose.yml          # Local Development
├── Jenkinsfile                 # CI/CD Pipeline
└── setup.sh                   # Setup Script
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- kubectl (for Kubernetes deployment)
- Jenkins (for CI/CD)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd ecommerce-platform
chmod +x setup.sh
./setup.sh
```

### 2. Local Development with Docker
```bash
# Start all services
docker-compose up --build

# Stop services
docker-compose down
```

### 3. Local Development without Docker
```bash
# 1. Start Couchbase
docker run -d --name couchbase \
  -p 8091-8093:8091-8093 \
  -p 11210:11210 \
  couchbase:community-7.2.0

# 2. Start Backend
cd backend
./mvnw spring-boot:run

# 3. Start Frontend (in new terminal)
cd frontend
npm start
```

## 🔧 Configuration

### Environment Variables

#### Backend (Spring Boot)
```yaml
# application.yml
server:
  port: 8080

spring:
  couchbase:
    connection-string: couchbase://localhost:11210
    username: Administrator
    password: password
    bucket-name: ecommerce

jwt:
  secret: mySecretKey
  expiration: 86400000  # 24 hours

cors:
  allowed-origins: http://localhost:3000
```

#### Frontend (React)
```json
{
  "name": "ecommerce-frontend",
  "proxy": "http://localhost:8080"
}
```

### Couchbase Setup
1. Access Couchbase Admin UI: http://localhost:8091
2. Setup cluster with username: `Administrator`, password: `password`
3. Create bucket named `ecommerce`
4. Create indexes for better query performance:
```sql
CREATE PRIMARY INDEX ON `ecommerce`;
CREATE INDEX `idx_user_username` ON `ecommerce`(username) WHERE type = "User";
CREATE INDEX `idx_product_active` ON `ecommerce`(active) WHERE type = "Product";
```

## 🛠️ Development

### Backend Development
```bash
cd backend

# Run tests
./mvnw test

# Run with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Build JAR
./mvnw clean package
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### API Endpoints

#### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

#### Products
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search?name={name}` - Search products
- `GET /api/products/category/{category}` - Get products by category
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/{id}` - Update product (Admin only)
- `DELETE /api/products/{id}` - Delete product (Admin only)

#### Orders (Coming Soon)
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order details

## 🐳 Docker Deployment

### Building Images
```bash
# Build backend image
cd backend
docker build -t ecommerce-backend:latest .

# Build frontend image
cd frontend
docker build -t ecommerce-frontend:latest .
```

### Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=2 --scale frontend=2
```

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (minikube, EKS, GKE, AKS)
- kubectl configured
- Docker images pushed to registry

### Deploy to Kubernetes
```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n ecommerce
kubectl get services -n ecommerce

# View logs
kubectl logs -f deployment/ecommerce-backend -n ecommerce

# Scale deployments
kubectl scale deployment ecommerce-backend --replicas=3 -n ecommerce
```

### Access Application
```bash
# Port forward for local access
kubectl port-forward service/ecommerce-frontend-service 3000:80 -n ecommerce

# Or setup ingress
kubectl apply -f k8s/frontend-deployment.yaml
```

## 🔄 CI/CD with Jenkins

### Jenkins Setup
1. Install Jenkins with Kubernetes and Docker plugins
2. Configure credentials:
   - `kubeconfig` - Kubernetes config file
   - `docker-registry-credentials` - Docker registry credentials
3. Create multibranch pipeline from repository

### Pipeline Stages
1. **Checkout** - Clone repository
2. **Build Backend** - Maven build
3. **Test Backend** - Run unit tests
4. **Build Frontend** - npm build
5. **Build Docker Images** - Create container images
6. **Security Scan** - Vulnerability scanning
7. **Deploy to Staging** - Deploy to staging environment
8. **Integration Tests** - Run integration tests
9. **Deploy to Production** - Manual approval required

### Environment Variables in Jenkins
```groovy
environment {
    DOCKER_REGISTRY = 'your-registry.com'
    BACKEND_IMAGE = "${DOCKER_REGISTRY}/ecommerce-backend"
    FRONTEND_IMAGE = "${DOCKER_REGISTRY}/ecommerce-frontend"
}
```

## 🏗️ Features

### Implemented
- ✅ User authentication with JWT
- ✅ Product catalog with search and filtering
- ✅ Shopping cart functionality (Redux state)
- ✅ Responsive UI with Material-UI
- ✅ Docker containerization
- ✅ Kubernetes deployment
- ✅ Jenkins CI/CD pipeline
- ✅ Health checks and monitoring

### Coming Soon
- 🔄 Order management system
- 🔄 Payment integration
- 🔄 User profile management
- 🔄 Admin dashboard
- 🔄 Product reviews and ratings
- 🔄 Email notifications
- 🔄 Advanced analytics

## 🧪 Testing

### Backend Testing
```bash
cd backend
./mvnw test                    # Unit tests
./mvnw integration-test        # Integration tests
```

### Frontend Testing
```bash
cd frontend
npm test                       # Unit tests
npm run test:e2e              # E2E tests (if configured)
```

### API Testing
Use tools like Postman or curl to test API endpoints:
```bash
# Login
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Get products
curl -X GET http://localhost:8080/api/products
```

## 📊 Monitoring

### Health Checks
- Backend: http://localhost:8080/actuator/health
- Frontend: http://localhost:3000/health (custom nginx endpoint)

### Metrics
- Backend metrics: http://localhost:8080/actuator/metrics
- Application info: http://localhost:8080/actuator/info

## 🔒 Security

### Authentication
- JWT-based authentication
- Password encryption with BCrypt
- Role-based access control (USER, ADMIN)

### Security Headers
- CORS configuration
- Security headers via Spring Security
- HTTPS in production (configured via ingress)

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check Couchbase connection
curl http://localhost:8091/pools

# Check Java version
java -version

# Check application logs
./mvnw spring-boot:run --debug
```

#### Frontend build errors
```bash
# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version
```

#### Kubernetes deployment issues
```bash
# Check pod status
kubectl describe pod <pod-name> -n ecommerce

# Check logs
kubectl logs <pod-name> -n ecommerce

# Check services
kubectl get svc -n ecommerce
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Backend Development: Spring Boot, Couchbase, Security
- Frontend Development: React, TypeScript, Material-UI
- DevOps: Docker, Kubernetes, Jenkins
- Database: Couchbase NoSQL

## 🔗 Useful Links

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://reactjs.org/docs)
- [Couchbase Documentation](https://docs.couchbase.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)

---

For more detailed information about specific components, please refer to the individual README files in each directory.