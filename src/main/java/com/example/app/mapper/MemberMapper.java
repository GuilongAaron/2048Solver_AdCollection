package com.example.app.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.app.domain.Member;

@Mapper
public interface MemberMapper {
	// List<Member> selectMembers();
	void addMember(Member member);
}
