import {
	alertPdfMensuales,
	deleteRow,
	disabledPrintButton,
	editRow,
	editRowJornalesProveedores,
	openModal,
	print,
	removeErrors,
	selectAllRows,
	totalSum,
	updatedRow,
	updatingStateCheckbox,
	validateEmptyInputMensuales,
	closeModal,
	checkInputExcel,
	checkInputExcelMensuales,
	updateRowJoranlesProveedores,
	addRow,
	deleteAllRows,
	openModalAdd,
} from "./funciones.js";

import {
	arrayMensuales,
	mensualesSchema,
	$inputExcelMensuales,
	tablaMensuales,
} from "./main.js";

import {
	arrayJornales,
	jornalesSchema,
	$inputExcelJornales,
	tableJornales,
} from "./jornales.js";

import {
	$inputExcelProveedores,
	arrayProveedores,
	proveedoresSchema,
	tableProveedores,
} from "./proveedores.js";

let locationPathName = window.location.pathname;
let regEx = /([^/]+)\.html$/g;
let newStr = String(locationPathName.match(regEx)).split(".")[0];

window.addEventListener("DOMContentLoaded", e => {
	if (newStr === "index") {
		disabledPrintButton("#btn_mensuales-imprimir", tablaMensuales);
	}
	if (newStr === "Jornales") {
		disabledPrintButton("#btn_jornales-imprimir", tableJornales);
	}
	if (newStr === "Proveedores") {
		disabledPrintButton("#btn_proveedores-imprimir", tableProveedores);
	}

	window.addEventListener("click", e => {
		if (e.target.matches(".btn_mensuales-edit")) {
			editRow(e);
		}

		if (e.target.matches(".btn_jornales-edit")) {
			openModal(".modal-edit");
			editRowJornalesProveedores(e, "jornales");
		}

		if (e.target.matches(".btn_proveedores-edit")) {
			openModal(".modal-edit");
			editRowJornalesProveedores(e, "proveedores");
		}

		if (
			e.target.matches(".btn_modal-cancelar") ||
			e.target.matches(".fa-xmark")
		) {
			closeModal(".modal-edit");
		}

		if (
			e.target.matches(".modal-add .btn_modal-cancelar") ||
			e.target.matches(" .modal-add .fa-xmark")
		) {
			closeModal(".modal-add");
		}

		if (
			e.target.matches(".btn_modal-delete-close") ||
			e.target.matches(".btn_modal-delete-close .fa-xmark") ||
			e.target.matches(".btn_modal-delete-cancelar")
		) {
			closeModal(".modal_delete-all");
		}

		if (e.target.matches(".btn_mensuales-guardar")) {
			e.preventDefault();
			updatedRow(e, tablaMensuales);
			closeModal(".modal-edit");
		}

		if (e.target.matches(".btn_jornales-guardar")) {
			updateRowJoranlesProveedores(e, tableJornales, "jornales");
			closeModal(".modal-edit");
		}

		if (e.target.matches(".btn_proveedores-guardar")) {
			updateRowJoranlesProveedores(e, tableProveedores, "proveedores");
			closeModal(".modal-edit");
		}

		if (
			e.target.matches(".btn_mensuales-delete") ||
			e.target.matches("#tablaMensuales .fa-trash")
		) {
			deleteRow(e, "mensuales", tablaMensuales);
		}

		if (e.target.matches(".btn_jornales-delete")) {
			deleteRow(e, "jornales", tableJornales);
		}

		if (e.target.matches(".btn_proveedores-delete")) {
			deleteRow(e, "proveedores", tableProveedores);
		}

		if (
			e.target.matches("#modal_mensuales-edicion .btn_modal-cancelar") ||
			e.target.matches("#modal_mensuales-edicion .fa-xmark")
		) {
			removeErrors("#form_mensuales");
		}

		if (
			e.target.matches("#modal_mensuales-añadir .btn_modal-cancelar") ||
			e.target.matches("#modal_mensuales-añadir .fa-xmark")
		) {
			removeErrors("#form_mensuales-add");
		}

		if (
			e.target.matches("#btn_mensuales-imprimir") ||
			e.target.matches("#btn_mensuales-imprimir .fa-print")
		) {
			print(tablaMensuales, "mensuales");
		}

		if (
			e.target.matches("#btn_jornales-imprimir") ||
			e.target.matches("#btn_jornales-imprimir .fa-print")
		) {
			print(tableJornales, "jornales");
		}

		if (
			e.target.matches("#btn_proveedores-imprimir") ||
			e.target.matches("#btn_proveedores-imprimir .fa-print")
		) {
			print(tableProveedores, "proveedores");
		}

		if (e.target.matches("#retryMensuales")) {
			alertPdfMensuales();
		}

		if (
			e.target.matches("#btn_mensuales-añadir") ||
			e.target.matches("#btn_mensuales-añadir .fa-plus")
		) {
			openModalAdd("#modal_mensuales-añadir");
		}

		if (
			e.target.matches("#btn_jornales-añadir") ||
			e.target.matches("#btn_jornales-añadir .fa-plus")
		) {
			openModalAdd("#modal_jornales-añadir", "jornales");
		}

		if (
			e.target.matches("#btn_proveedores-añadir") ||
			e.target.matches("#btn_proveedores-añadir .fa-plus")
		) {
			openModalAdd("#modal_proveedores-añadir", "proveedores");
		}

		if (e.target.matches(".btn_mensuales-añadir")) {
			addRow(tablaMensuales, "mensuales");
			closeModal(".modal-add");
		}

		if (e.target.matches(".btn_jornales-añadir")) {
			addRow(tableJornales, "jornales");
			closeModal(".modal-add");
		}

		if (e.target.matches(".btn_proveedores-añadir")) {
			addRow(tableProveedores, "proveedores");
			closeModal(".modal-add");
		}

		if (
			e.target.matches(".btn_delete-all strong") ||
			e.target.matches(".btn_delete-all")
		) {
			openModal(".modal_delete-all");
		}

		if (e.target.matches(".btn_mensuales-eliminar-todos")) {
			deleteAllRows(tablaMensuales, "mensuales");
			closeModal(".modal_delete-all");
		}

		if (e.target.matches(".btn_jornales-eliminar-todos")) {
			deleteAllRows(tableJornales, "jornales");
			closeModal(".modal_delete-all");
		}

		if (e.target.matches(".btn_proveedores-eliminar-todos")) {
			deleteAllRows(tableProveedores, "proveedores");
			closeModal(".modal_delete-all");
		}
	});

	window.addEventListener("change", e => {
		if (e.target.matches("#inputExcelMensuales")) {
			checkInputExcelMensuales(
				$inputExcelMensuales,
				mensualesSchema,
				arrayMensuales,
				tablaMensuales
			);
		}

		if (e.target.matches("#inputExcelJornales")) {
			checkInputExcel(
				$inputExcelJornales,
				jornalesSchema,
				arrayJornales,
				tableJornales
			);
		}

		if (e.target.matches("#inputExcelProveedores")) {
			checkInputExcel(
				$inputExcelProveedores,
				proveedoresSchema,
				arrayProveedores,
				tableProveedores
			);
		}

		if (
			e.target.matches("#form_mensuales input") ||
			e.target.matches("#form_mensuales-add input")
		) {
			totalSum("mensuales", e);
		}

		if (
			e.target.matches("#form_mensuales input[name='NOMBRE'] ") ||
			e.target.matches("#form_mensuales input[name='DNI']") ||
			e.target.matches("#form_mensuales input[name='FECHA']")
		) {
			validateEmptyInputMensuales(
				e,
				"#form_mensuales",
				".btn_mensuales-guardar"
			);
		}

		if (
			e.target.matches("#form_mensuales-add input[name='NOMBRE']") ||
			e.target.matches("#form_mensuales-add input[name='DNI']") ||
			e.target.matches("#form_mensuales-add input[name='FECHA']")
		) {
			validateEmptyInputMensuales(
				e,
				"#form_mensuales-add",
				".btn_mensuales-añadir"
			);
		}

		if (e.target.matches("#mensuales_checkbox-all")) {
			selectAllRows(e, tablaMensuales);
			disabledPrintButton("#btn_mensuales-imprimir", tablaMensuales);
		}

		if (e.target.matches("#jornales_checkbox-all")) {
			selectAllRows(e, tableJornales);
			disabledPrintButton("#btn_jornales-imprimir", tableJornales);
		}

		if (e.target.matches("#proveedores_checkbox-all")) {
			selectAllRows(e, tableProveedores);
			disabledPrintButton("#btn_proveedores-imprimir", tableProveedores);
		}

		if (e.target.matches("#tablaMensuales .select-checkbox")) {
			updatingStateCheckbox(tablaMensuales);
			disabledPrintButton("#btn_mensuales-imprimir", tablaMensuales);
		}

		if (e.target.matches("#tablaJornales .select-checkbox")) {
			updatingStateCheckbox(tableJornales);
			disabledPrintButton("#btn_jornales-imprimir", tableJornales);
		}

		if (e.target.matches("#tablaProveedores .select-checkbox")) {
			updatingStateCheckbox(tableProveedores);
			disabledPrintButton("#btn_proveedores-imprimir", tableProveedores);
		}
	});
});
