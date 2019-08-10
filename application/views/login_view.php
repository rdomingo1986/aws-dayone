<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, inicial-scale=1.0" />
  <title>..:: MAPAS ::..</title>
  <link rel="stylesheet" href="<?php echo base_url().'css/bootstrap.min.css';?>" />
  <script type="text/javascript" src="<?php echo base_url().'js/jquery.min.js';?>"></script>
  <script type="text/javascript" src="<?php echo base_url().'js/bootstrap.min.js';?>"></script>
  <script type="text/javascript" src="<?php echo base_url().'js/login.js';?>"></script>
</head>
<body>
  <input type="hidden" name="base_url" id="base_url" value="<? echo base_url();?>" />
  <div class="container">
    <br /><br /><br /><br /><br /><br />
    <div class="row">
      <div class="col-lg-4"></div>
      <div class="col-lg-4">
        <div class="panel panel-default">
          <div class="panel-body">    
            <center><img width="100" src="<?php echo base_url().'/images/avatar.png';?>" class="img-responsive img-circle" alt="Cinque Terre"></center>
            <br /><br />
            <form role="form" id="inicioform">
              <div class="form-group">
                <div class="input-group">
                  <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
                  <input type="text" class="form-control" id="usuario" placeholder="Usuario" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();">  
                </div>
              </div>
              <div class="form-group">
                <div class="input-group">
                  <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                  <input type="password" class="form-control" id="clave" style="text-transform:uppercase;" placeholder="Contraseña">
                </div>
              </div>
              <center>
                <div class="form-group">
                  <button type="submit" id="entrar" class="btn btn-default">Entrar</button>
                </div>
              </center>
            </form>
          </div>
        </div>
      </div>
      <div class="col-lg-4"></div>
    </div>
  </div>
</body>
</html>