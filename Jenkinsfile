	pipeline {
		agent any

		environment {
			DOCKER_HUB_REPO = 'sauravnirala/nodejs-todo-devops-project' // Docker Hub repo
		}

		stages {

			stage('Checkout Code') {
				steps {
					git branch: 'main', url: 'https://github.com/sauravnirala/nodejs-todo-devops-project.git'
				}
				post {
					success {
						emailext(
							subject: "checkout Success",
							body: "checkout completed",
							to: "sauravnirala44@gmail.com"
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
			}

			stage('DOCKER LOGIN & PUSH') {
				steps {
					withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
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
							subject: "hub login",
							body: "image pushed",
							to: "sauravnirala44@gmail.com"
						)
					}
				}
			}
			
			stage('Docker Logout') {
				steps {
					sh "docker logout"
					echo "All images pushed to DockerHub successfully."
				}
			}
			
			stage('Deploy to Kubernetes') {
				steps {
					sh '''
						kubectl apply -f lbproject.yml

						# Update image to the new pushed version
						kubectl set image deployment/nodejs-todo-app nodejs-todo-app=$DOCKER_HUB_REPO:v2

						# Wait for rollout to finish
						kubectl rollout status deployment/nodejs-todo-app

					'''
			}
			post {
				success {
					emailext(
						subject: "Kubernetes Deploy Success",
						body: "nodejs-todo-app deployed successfully. Image: ${DOCKER_HUB_REPO}:v2",
						to: "sauravnirala44@gmail.com"
					)
			
				}

			}
		}
	}
	}
	

