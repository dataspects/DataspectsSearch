<?php

class SpecialDataspectsSearchBackstage extends SpecialPage {
	function __construct() {
		parent::__construct( 'DataspectsSearchBackstage' );
	}

	function execute( $par ) {
		$request = $this->getRequest();
		$output = $this->getOutput();
		$this->setHeaders();
		$output->addHTML( '<table class="dataspectsSearchBackstage">
			<tr>
				<td colspan=2>
					Hello
				</td>
			</tr>
		</table>' );
        $output->addJsConfigVars(array('wgDataspectsSearchMasterKey' => $GLOBALS['wgDataspectsSearchMasterKey']));
		$output->addModules( 'ext.dataspectsSearchBackstage' );
	}
}