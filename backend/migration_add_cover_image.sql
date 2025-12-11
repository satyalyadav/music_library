-- Migration: Add cover_image column to song table
-- Run this if you have an existing database

ALTER TABLE IF EXISTS public.song
ADD COLUMN IF NOT EXISTS cover_image text COLLATE pg_catalog."default";

