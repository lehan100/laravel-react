<?php
namespace App\Repositories;

interface EloquentRepositoryInterface
{
    public function find(int $id);
    public function lists($params = null, $options = null);
    public function get($params = null, $options = null);
    public function save($params = null, $options = null);
    public function delete($params = null, $options = null);
}