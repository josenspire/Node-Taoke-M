
# Backup
  This is a node.js project about taokouling create.  
  The project built by Express-cli
  
# module
  Express / Supervisor / fs / node-schedule / mongooes / jwt-simple etc..
  
# use
  npm i
  
  cd bin
  
  supervisor/node www
  
# Test url
  ``index
  http://localhost/

  ``admin
  http://localhost/users/admin

  account information:
          username: admin
          password: bearadmin

  Note: if want to go to admin center, login admin account and click the 'admin' link in index top position.
        the admin account role is >= 50
        normal account role is < 50

  ``multiple
  http://localhost/multiple
  Note: This funciton is in order to create taokouling in multiple
  
  (1) http://localhost/multiple/page1 ---- This multiple tools is including classify link. 
  (2) http://localhost/multiple/page2 ---- This multiple tools is without classify link. 

  In this page there are two keyboard shortcuts.
  '+' : To add a new PID input item.
  '-' : To delete the final PID input item.
