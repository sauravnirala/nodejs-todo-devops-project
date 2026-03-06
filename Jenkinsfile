pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git 'https://github.com/example/nodejs-app.git'
            }
        }

        stage('Create Dockerfile & Build Image') {
            steps {
                sh '''
                cat <<EOF > Dockerfile
                # Stage 1 : Build
                FROM node:18 AS build
                WORKDIR /app
                COPY . .
                RUN npm install
                RUN npm run build

                # Stage 2 : Runtime
                FROM nginx:alpine
                COPY --from=build /app/build /usr/share/nginx/html
                EXPOSE 80
                CMD ["nginx", "-g", "daemon off;"]
                EOF

                docker build -t nodejs-multistage-app .
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker run -d -p 8080:80 nodejs-multistage-app'
            }
        }

    }
}
