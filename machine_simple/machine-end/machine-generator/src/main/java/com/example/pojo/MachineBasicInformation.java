package com.example.machineend.pojo;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * <p>
 * 
 * </p>
 *
 * @author whz
 * @since 2022-02-18
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class MachineBasicInformation implements Serializable {

    private static final long serialVersionUID = 1L;

    private String machineNumber;

    private String imei;

    private String brand;

    private String model;

    private String sku;

    private String quality;

    private String conditionDescription;

    private BigDecimal bidPrice;

    private String purchaseChannel;

    private LocalDateTime bidDate;


}
