<?php

/*
 * jComet Version String
 */
	define("JCOMET_VERSION", "0.1.1")

session_start();

if (isset($_GET['reset'])) {
	session_unset();
	session_destroy();
	die();
}

class DataBox {
	public $value = 1;
}

if (! isset($_SESSION['box'])) {
	$_SESSION['box'] = new DataBox();
}

sleep(2);
echo $_SESSION['box']->value++ . " ";

?>
