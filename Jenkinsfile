pipeline {
 agent any

 stages {

  stage('Checkout'){
   steps{
    git 'https://github.com/yourusername/nodejs-todo-app.git'
   }
  }

  stage('Install Dependencies'){
   steps{
    sh 'npm install'
   }
  }

  stage('Build Docker Image'){
   steps{
    sh 'docker build -t todo-node-app .'
   }
  }

  stage('Run Container'){
   steps{
    sh '''
    docker rm -f todoapp || true
    docker run -d -p 3000:3000 --name todoapp todo-node-app
    '''
   }
  }

 }
}
