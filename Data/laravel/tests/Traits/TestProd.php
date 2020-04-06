<?php

namespace Tests\Traits;

trait TestProd
{
  protected function skipTestIfNotProd($message = '')
  {
    if ($this->notRunTestingProd()) {
      $this->markTestSkipped($message);
    }
  }

  protected function notRunTestingProd()
  {
    return env('TEST_PROD') !== true;
  }
}
