pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = 'sauravnirala/nodejs-todo-devops-project'
        EMAIL = 'sauravnirala240@gmail.com'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/sauravnirala/nodejs-todo-devops-project.git'
            }
            post {
                success {
                    emailext(
                        subject: "Checkout SUCCESS",
                        body: "Code checkout completed successfully.",
                        to: "${EMAIL}"
                    )
                }
                failure {
                    emailext(
                        subject: "Checkout FAILED",
                        body: "Code checkout failed.",
                        to: "${EMAIL}"
                    )
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build --no-cache -t nodejs-multistage-app .
                '''
            }
            post {
                success {
                    emailext(
                        subject: "Docker Build SUCCESS",
                        body: "Docker image built successfully.",
                        to: "${EMAIL}"
                    )
                }
                failure {
                    emailext(
                        subject: "Docker Build FAILED",
                        body: "Docker build failed.",
                        to: "${EMAIL}"
                    )
                }
            }
        }

        stage('Docker Login & Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker tag nodejs-multistage-app $DOCKER_HUB_REPO:v2
                        docker push $DOCKER_HUB_REPO:v2
                    '''
                }
            }
            post {
                success {
                    emailext(
                        subject: "Docker Push SUCCESS",
                        body: "Image pushed to DockerHub successfully.",
                        to: "${EMAIL}"
                    )
                }
                failure {
                    emailext(
                        subject: "Docker Push FAILED",
                        body: "Docker push failed.",
                        to: "${EMAIL}"
                    )
                }
            }
        }

        stage('Docker Logout') {
            steps {
                sh 'docker logout'
            }
            post {
                success {
                    emailext(
                        subject: "Docker Logout SUCCESS",
                        body: "Logged out from DockerHub.",
                        to: "${EMAIL}"
                    )
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f lbproject.yml
                    kubectl set image deployment/njdeploy njcont=$DOCKER_HUB_REPO:v2
                    kubectl rollout status deployment/njdeploy
                '''
            }
            post {
                success {
                    emailext(
                        subject: "Kubernetes Deploy SUCCESS",
                        body: "Application deployed successfully to Kubernetes.",
                        to: "${EMAIL}"
                    )
                }
                failure {
                    emailext(
                        subject: "Kubernetes Deploy FAILED",
                        body: "Deployment failed. Check logs.",
                        to: "${EMAIL}"
                    )
                }
            }
        }
    }

    // 🔥 Final Summary Email
    post {
        always {
            emailext(
                subject: "📊 Pipeline Result: ${currentBuild.currentResult}",
                body: """
                Pipeline Execution Completed

                Job: ${env.JOB_NAME}
                Build: ${env.BUILD_NUMBER}
                Status: ${currentBuild.currentResult}

                Docker Image: ${DOCKER_HUB_REPO}:v2
                """,
                to: "${EMAIL}"
            )
        }
    }
}
