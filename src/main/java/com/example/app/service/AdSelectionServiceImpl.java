package com.example.app.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.app.domain.AdType;
import com.example.app.mapper.AdTypeMapper;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(rollbackFor=Exception.class)
@RequiredArgsConstructor
public class AdSelectionServiceImpl implements AdSelectionService{
//	private final MemberMapper memberMapper;
	private final AdTypeMapper adTypeMapper;
	
	
	@Override
	public List<AdType> getAdList() throws Exception{
		return adTypeMapper.selectAll();
	}
	
	@Override
	public List<AdType> getAdListByTS() throws Exception{
		return adTypeMapper.selectAll();
	}
}
