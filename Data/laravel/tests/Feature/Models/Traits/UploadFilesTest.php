<?php
use Tests\Stubs\Models\UploadFilesStub;
use Tests\TestCase;

class UploadFilesTest extends TestCase
{
  private $obj;

  protected function setUp(): void
  {
    parent::setUp();
    $this->obj = new UploadFilesStub();
    UploadFilesStub::dropTable();
    UploadFilesStub::makeTable();
  }

  public function testMakeOldFieldsOnSaving()
  {
    $this->obj->fill([
      'name' => 'teste',
      'file1' => 'test1.mp4',
      'file2' => 'test2.mp4',
    ]);
    $this->obj->save();
    $this->assertCount(0, $this->obj->oldFiles);

    $this->obj->update([
      'name' => 'update',
      'file2' => 'update.mp4'
    ]);

    $this->assertEqualsCanonicalizing(['test2.mp4'], $this->obj->oldFiles);
  }

  public function testMakeOldFilesNullOnSaving()
  {
    $this->obj->fill([
     'name' => 'teste'
    ]);
    $this->obj->save();
    $this->obj->update([
      'name' => 'update',
      'file2' => 'update.mp4'
    ]);

    $this->assertEqualsCanonicalizing([], $this->obj->oldFiles);
  }


}