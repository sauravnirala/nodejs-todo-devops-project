	pipeline {
		agent any

		environment {
			DOCKER_HUB_REPO = 'sauravnirala/nodejs-todo-devops-project' // Docker Hub repo
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
						kubectl set image deployment/njdeploy njcont=$DOCKER_HUB_REPO:v2

						# Wait for rollout to finish
						kubectl rollout status deployment/njdeploy

					'''
			    }
			}
			
			// Final Summary Email
			post {
				always {
					emailext(
						subject: "Pipeline Result: ${currentBuild.currentResult}",
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

	}

	

