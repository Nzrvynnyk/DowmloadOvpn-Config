pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "python-docker"
        CONTAINER_ID = "openvpnget"
        BASE_URL = ''
    }
    
    stages {
        stage ('Run Docke image'){
            steps {
                script {
                    sh "docker run -d -it -v /usr/share/nginx/html:/app/download --name ${CONTAINER_ID} ${DOCKER_IMAGE} "
                }
            }
        }
        stage('Run Python script') {
            steps {
                sh "docker exec -i ${CONTAINER_ID} python3 opencpnget.py"
            }
        }
        stage('Coppy file'){
            steps {
                sh "docker exec -i ${CONTAINER_ID} ./move.sh"
            }
        }
        stage('Send link to download'){
            steps {
                withCredentials([string(credentialsId: 'chatid', variable: 'CHAT_ID')]) {
                sh  ("curl -s -X POST POST ${url}  -d chat_id=${CHAT_ID} -d text='Download a new Config ${BASE_URL}'")
                }
            }
        }
    }
    post {
        always {
            script {
                sh "docker rm -f ${CONTAINER_ID}"
            }
        }
        failure {
            script {
                withCredentials([string(credentialsId: 'chatid', variable: 'CHAT_ID')]) {
                sh  ("curl -s -X POST ${url} -d chat_id=${CHAT_ID} -d text='operation FAILED :x: <${env.BUILD_URL}consoleFull|Review Console Log> '")
                }
            }
        }    
        
    }   
}    
