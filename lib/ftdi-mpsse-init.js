'use strict';

// Set initial states of the MPSSE interface
// - low byte, both pin directions and output values
// Pin name Signal  Direction   Initial State
//  ADBUS0  TCK/SK  output  1   low     0
//  ADBUS1  TDI/DO  output  1   low     0
//  ADBUS2  TDO/DI  input   0           0
//  ADBUS3  TMS/CS  output  1   low     0
//  ADBUS4  ACT     output  1   low     0
//  ADBUS5  GPIOL1  input   0           0
//  ADBUS6  GPIOL2  input   0           0
//  ADBUS7  GPIOL3  input   0           0

// Set initial states of the MPSSE interface
// - high byte, both pin directions and output values
// Pin name Signal  Direction   Initial State
//  ACBUS0  GPIOH0  input   0           0
//  ACBUS1  GPIOH1  input   0           0
//  ACBUS2  GPIOH2  input   0           0
//  ACBUS3  GPIOH3  input   0           0
//  ACBUS4  GPIOH4  input   0           0
//  ACBUS5  GPIOH5  input   0           0
//  ACBUS6  GPIOH6  input   0           0
//  ACBUS7  GPIOH7  input   0           0

module.exports = [0x80, 0b00000000, 0b00011011]; // ADBUS
