pipeline {
  agent any
  stages {
    stage('git scm update') {
      steps {
        git url: 'https://github.com/pjs818/front_ops', branch: 'master'
      }
    }
    stage('docker build and push') {
      steps {
        sh '''
        docker build --no-cache -t 192.168.1.10:8443/front-ops .
        docker push 192.168.1.10:8443/front-ops
        '''
      }
    }
    stage('deploy kubernetes') {
      steps {
        sh '''
        kubectl delete -f service.yaml
        kubectl delete -f deployment.yaml
        kubectl apply -f deployment.yaml
        kubectl apply -f service.yaml
        '''
      }
      
    }
  }
}
