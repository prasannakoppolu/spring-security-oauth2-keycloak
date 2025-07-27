pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-registry.com'
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/ecommerce-backend"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/ecommerce-frontend"
        KUBECONFIG = credentials('kubeconfig')
        DOCKER_CREDENTIALS = credentials('docker-registry-credentials')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh './mvnw clean package -DskipTests'
                }
            }
        }
        
        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh './mvnw test'
                }
            }
            post {
                always {
                    publishTestResults(
                        testResultsPattern: 'backend/target/surefire-reports/*.xml'
                    )
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        dir('backend') {
                            script {
                                def backendImage = docker.build("${BACKEND_IMAGE}:${env.BUILD_NUMBER}")
                                docker.withRegistry('https://' + DOCKER_REGISTRY, DOCKER_CREDENTIALS) {
                                    backendImage.push()
                                    backendImage.push("latest")
                                }
                            }
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        dir('frontend') {
                            script {
                                def frontendImage = docker.build("${FRONTEND_IMAGE}:${env.BUILD_NUMBER}")
                                docker.withRegistry('https://' + DOCKER_REGISTRY, DOCKER_CREDENTIALS) {
                                    frontendImage.push()
                                    frontendImage.push("latest")
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('Security Scan') {
            parallel {
                stage('Backend Security Scan') {
                    steps {
                        sh "docker run --rm -v \$(pwd)/backend:/workspace aquasec/trivy fs /workspace"
                    }
                }
                stage('Frontend Security Scan') {
                    steps {
                        dir('frontend') {
                            sh 'npm audit --audit-level high'
                        }
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    sh """
                        kubectl apply -f k8s/namespace.yaml
                        kubectl apply -f k8s/couchbase-deployment.yaml
                        kubectl apply -f k8s/backend-deployment.yaml
                        kubectl apply -f k8s/frontend-deployment.yaml
                        
                        kubectl set image deployment/ecommerce-backend ecommerce-backend=${BACKEND_IMAGE}:${env.BUILD_NUMBER} -n ecommerce
                        kubectl set image deployment/ecommerce-frontend ecommerce-frontend=${FRONTEND_IMAGE}:${env.BUILD_NUMBER} -n ecommerce
                        
                        kubectl rollout status deployment/ecommerce-backend -n ecommerce
                        kubectl rollout status deployment/ecommerce-frontend -n ecommerce
                    """
                }
            }
        }
        
        stage('Integration Tests') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    sh """
                        kubectl wait --for=condition=ready pod -l app=ecommerce-backend -n ecommerce --timeout=300s
                        kubectl wait --for=condition=ready pod -l app=ecommerce-frontend -n ecommerce --timeout=300s
                    """
                    
                    // Run integration tests here
                    sh 'echo "Running integration tests..."'
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                script {
                    sh """
                        kubectl apply -f k8s/namespace.yaml
                        kubectl apply -f k8s/couchbase-deployment.yaml
                        kubectl apply -f k8s/backend-deployment.yaml
                        kubectl apply -f k8s/frontend-deployment.yaml
                        
                        kubectl set image deployment/ecommerce-backend ecommerce-backend=${BACKEND_IMAGE}:${env.BUILD_NUMBER} -n ecommerce
                        kubectl set image deployment/ecommerce-frontend ecommerce-frontend=${FRONTEND_IMAGE}:${env.BUILD_NUMBER} -n ecommerce
                        
                        kubectl rollout status deployment/ecommerce-backend -n ecommerce
                        kubectl rollout status deployment/ecommerce-frontend -n ecommerce
                    """
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            slackSend(
                color: 'good',
                message: "✅ Pipeline succeeded for ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
            )
        }
        failure {
            slackSend(
                color: 'danger',
                message: "❌ Pipeline failed for ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
            )
        }
    }
}