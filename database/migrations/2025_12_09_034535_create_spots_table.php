<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('spots', function (Blueprint $table) {
           $table->id();
            $table->string('name');
            $table->string('slug');
            $table->string('geojson_file');

            // Foreign key ke categories
            $table->foreignId('category_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete();

            // Foreign key ke spot_storages
            $table->foreignId('spot_storage_id')
                ->nullable()
                ->constrained('spot_storages')
                ->nullOnDelete();

            $table->timestamps();
        });
       
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spots');
    }
};
