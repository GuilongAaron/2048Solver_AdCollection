package com.example.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.app.domain.Member;
import com.example.app.mapper.MemberMapper;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/")
@RequiredArgsConstructor
public class MemberController {
	private final MemberMapper mapper;
	
	
	// I may not need this function.
//	@GetMapping("/welcome2048")
//	public String list(Model model) throws Exception{
//		return "welcome2048";
//	}
	
	//member add form display
	@GetMapping("/welcome")
	public String addGet(Model model) throws Exception{
		Member member = new Member();
		member.setAge(null);
		member.setAd_Id(null);
		model.addAttribute("member", member);
		return "welcome";
		
	}
	
	// member information addition
	@PostMapping("/welcome")
	public String addPost(
			@Valid Member member, 
			Errors errors,
			Model model
			) throws Exception{
		if(errors.hasErrors()) {
			return "welcome";
		}
			mapper.addMember(member);
			return "redirect:/game2048";
	}
	
	@GetMapping("/game2048")
	public String gameGet(Model model) throws Exception{
		Member member = new Member();
		member.setAge(null);
		member.setAd_Id(null);
		model.addAttribute("member", member);
		return "game2048";
	}
	
	@PostMapping("/game2048")
	public String gamePost(
			@Valid Member member, 
			Errors errors,
			Model model) throws Exception{
//		System.out.println("postga20:"+member);
		if(errors.hasErrors()) {
			return "redirect:/welcome";
		}
		return "redirect:/game2048";
	}
	


}
