package com.example.app.mapper;
import java.util.List;

import com.example.app.domain.AdType;

public interface AdTypeMapper {
	
	List<AdType> selectAll() throws Exception;
	
}