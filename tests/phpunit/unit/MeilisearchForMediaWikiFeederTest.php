<?php

/**
 * @group Feeder
 * @covers DataspectsSearchFeeder
 */
namespace MediaWiki\Extension\DataspectsSearch\Tests;

use MediaWiki\Extension\DataspectsSearch\DataspectsSearch;

class DataspectsSearchFeederTest extends \MediaWikiUnitTestCase {

	protected function setUp(): void {
		parent::setUp();
	}

	protected function tearDown(): void {
		parent::tearDown();
	}

	public function testMe() {
		$title = new \TitleValue(0, "Main Page");
		$this->assertTrue( true, "Just a test." );
	}
}
