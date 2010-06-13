<?php

session_start();

require_once "jcomet.php";

class MyPusher extends jCometPusher {
	protected $id = __CLASS__;
	protected $interval = 0.5;
	protected function get_data($previous) {
		$id = session_id();
		$link = mysql_connect('localhost', 'test', 'passwd');
		if ($previous == null) {
			mysql_query("delete from dbTest.tblComet where id='$id'", $link);
			mysql_query("insert into dbTest.tblComet (id, value) values ('$id', 'default')", $link);
			return 'default';
		} else {
			$result = mysql_query("select value from dbTest.tblComet where id='$id'");
			$result = mysql_fetch_assoc($result);
			return $result['value'];
		}
	}
}

new MyPusher();

?>
