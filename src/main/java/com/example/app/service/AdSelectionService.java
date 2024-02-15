package com.example.app.service;

import java.util.List;

import com.example.app.domain.AdType;

public interface AdSelectionService {
	List<AdType> getAdList() throws Exception;
	List<AdType> getAdListByTS() throws Exception;
}
