<?php 

namespace Tests\Traits;

trait TestProd
{
  protected function skipTestIfNotProd($message = '')
  {
    if($this->isTestingProd()){
      $this->markTestSkiped($message);
    }
  }

  protected function isTestingProd()
  {
    return env('TEST_PROD') !== false;
  }
}