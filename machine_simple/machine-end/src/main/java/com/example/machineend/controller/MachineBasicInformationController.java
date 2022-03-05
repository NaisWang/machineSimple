package com.example.machineend.controller;

import com.example.machineend.pojo.MachineBasicInformation;
import com.example.machineend.utils.RespBean;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author : whz
 */
@RestController

@RequestMapping("/machine-basic-information")
public class MachineBasicInformationController {

	@PutMapping("/")
	public RespBean putMachineBasicInformationController(@RequestBody List<MachineBasicInformation> machineBasicInformations) {
		System.out.println(machineBasicInformations);
		return null;
	}
}
