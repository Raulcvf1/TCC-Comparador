-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema colegiosUnivap
-- -----------------------------------------------------

CREATE SCHEMA IF NOT EXISTS `colegiosUnivap` DEFAULT CHARACTER SET utf8;
USE `colegiosUnivap`;

-- -----------------------------------------------------
-- Table `colegiosUnivap`.`Aluno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `colegiosUnivap`.`Aluno` (
  `matricula` INT(10) NOT NULL,
  `cpf` INT(11) NOT NULL,
  `nome` VARCHAR(128) NOT NULL,
  `email` VARCHAR(128) NOT NULL,
  `senha` VARCHAR(128) NOT NULL,
  `serie` INT(11) NOT NULL,
  `turma` VARCHAR(8) NOT NULL,
  PRIMARY KEY (`matricula`),
  UNIQUE INDEX `matricula_UNIQUE` (`matricula` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `colegiosUnivap`.`Professor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `colegiosUnivap`.`Professor` (
  `registro` INT(10) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(128) NOT NULL,
  `email` VARCHAR(128) NOT NULL,
  `senha` VARCHAR(128) NOT NULL,
  `path_foto` VARCHAR(256) NULL UNIQUE,
  PRIMARY KEY (`registro`),
  UNIQUE INDEX `registro_UNIQUE` (`registro` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `colegiosUnivap`.`Disciplina`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `colegiosUnivap`.`Disciplina` (
  `idDisciplina` INT(10) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(128) NOT NULL,
  `serie` INT(10) NOT NULL,
  `ano` INT(10) NOT NULL,
  `duplicado` BOOL NOT NULL,
  `linguagem` VARCHAR(6) NOT NULL, # zero = FALSE, um = TRUE
  `codigo_unico` VARCHAR(64) NOT NULL UNIQUE,
  `Professor_registro` INT(10) NOT NULL,
  PRIMARY KEY (`idDisciplina`),
  UNIQUE INDEX `idDisciplina_UNIQUE` (`idDisciplina` ASC),
  INDEX `fk_Disciplina_Professor_idx` (`Professor_registro` ASC),
  CONSTRAINT `fk_Disciplina_Professor`
    FOREIGN KEY (`Professor_registro`)
    REFERENCES `colegiosUnivap`.`Professor` (`registro`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `colegiosUnivap`.`Aluno_Disciplina`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `colegiosUnivap`.`Aluno_Disciplina` (
  `id_Aluno_matricula`INT(10) NOT NULL AUTO_INCREMENT,
  `Aluno_matricula` INT(10) NOT NULL,
  `Disciplina_idDisciplina` INT(10) NOT NULL,
  PRIMARY KEY (`id_Aluno_matricula`),
  INDEX `fk_Aluno_Disciplina_Aluno_idx` (`Aluno_matricula` ASC),
  CONSTRAINT `fk_Aluno_Disciplina_Aluno`
    FOREIGN KEY (`Aluno_matricula`)
    REFERENCES `colegiosUnivap`.`Aluno` (`matricula`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
	
-- -----------------------------------------------------
-- Table `colegiosUnivap`.`Atividade`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `colegiosUnivap`.`Atividade` (
  `idAtividade` INT(10) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(128) NOT NULL,
  `status` INT(10) NOT NULL,
  `Disciplina_idDisciplina` INT(10) NOT NULL,
  PRIMARY KEY (`idAtividade`),
  UNIQUE INDEX `idAtividade_UNIQUE` (`idAtividade` ASC),
  INDEX `fk_Atividade_Disciplina_idx` (`Disciplina_idDisciplina` ASC),
  CONSTRAINT `fk_Atividade_Disciplina`
    FOREIGN KEY (`Disciplina_idDisciplina`)
    REFERENCES `colegiosUnivap`.`Disciplina` (`idDisciplina`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `colegiosUnivap`.`Questao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `colegiosUnivap`.`Questao` (
  `idQuestao` INT(10) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(128) NOT NULL,
  `path_questao` VARCHAR(255) NOT NULL,
  `Atividade_idAtividade` INT(10) NOT NULL,
  PRIMARY KEY (`idQuestao`),
  UNIQUE INDEX `idQuestao_UNIQUE` (`idQuestao` ASC),
  INDEX `fk_Questao_Atividade_idx` (`Atividade_idAtividade` ASC),
  CONSTRAINT `fk_Questao_Atividade`
    FOREIGN KEY (`Atividade_idAtividade`)
    REFERENCES `colegiosUnivap`.`Atividade` (`idAtividade`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `colegiosUnivap`.`Entrada`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `colegiosUnivap`.`Entrada` (
  `idEntrada` INT(10) NOT NULL AUTO_INCREMENT,
  `path_entrada` VARCHAR(255) NOT NULL,
  `Questao_idQuestao` INT(10) NOT NULL,
  PRIMARY KEY (`idEntrada`), 
  UNIQUE INDEX `idEntrada_UNIQUE` (`idEntrada` ASC), 
  INDEX `fk_Entrada_Questao_idx` (`Questao_idQuestao` ASC), 
  CONSTRAINT `fk_Entrada_Questao`
    FOREIGN KEY (`Questao_idQuestao`)
    REFERENCES `colegiosUnivap`.`Questao` (`idQuestao`) 
    ON DELETE CASCADE
    ON UPDATE NO ACTION
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `colegiosUnivap`.`Entrega`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `colegiosUnivap`.`Entrega` (
  `idEntrega` INT(10) NOT NULL AUTO_INCREMENT,
  `nota` DECIMAL(5,2) NULL,
  `path_entrega` VARCHAR(255) NOT NULL,
  `caixa` VARCHAR(128) NOT NULL,
  `Questao_idQuestao` INT(10) NOT NULL, 
  `Aluno_matricula` INT(10) NOT NULL,
  PRIMARY KEY (`idEntrega`),
  UNIQUE INDEX `unique_Entrega` (`Questao_idQuestao`, `Aluno_matricula`),
  INDEX `fk_Entrega_Questao_idx` (`Questao_idQuestao` ASC), 
  INDEX `fk_Entrega_Aluno_idx` (`Aluno_matricula` ASC),
  CONSTRAINT `fk_Entrega_Questao`
    FOREIGN KEY (`Questao_idQuestao`)
    REFERENCES `colegiosUnivap`.`Questao` (`idQuestao`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Entrega_Aluno`
    FOREIGN KEY (`Aluno_matricula`)
    REFERENCES `colegiosUnivap`.`Aluno` (`matricula`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;