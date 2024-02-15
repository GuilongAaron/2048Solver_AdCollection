package com.example.app.domain;

import java.time.LocalDateTime;

import org.hibernate.validator.constraints.Range;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Member {

	private Integer id;
	
	@NotNull(message="年齢を入力してください。")
	@Range(min=0, max=150)
	private Integer age;
	
//	@Range(min=0, max=1)
	@NotNull(message="性別をチェックしてください。")
	private Integer gender; // 0 female, 1 male
	
	@NotNull(message="好きな広告を一つ選択してください。")
	private Integer ad_Id;
	
	private LocalDateTime created;
	
}
