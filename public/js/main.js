const d = document;
import { getFromLocalStorage, formatingNumberToMoneda } from "./funciones.js";

let arrayMensuales;

const mensualesSchema = {
	NOMBRE: {
		prop: "NOMBRE",
		type: String,
		required: true,
	},
	DNI: {
		prop: "DNI",
		type: Number,
		required: true,
	},
	FECHA: {
		prop: "FECHA",
		type: Date,
		required: true,
	},
	"HABERES MES": {
		prop: "HABERES MES",
		type: String,
	},
	"HORAS EXTRAS": {
		prop: "HORAS EXTRAS",
		type: String,
	},
	FERIADO: {
		prop: "FERIADO",
		type: String,
	},
	VACACIONES: {
		prop: "VACACIONES",
		type: String,
	},
	ALMUERZO: {
		prop: "ALMUERZO",
		type: String,
	},
	ADELANTO: {
		prop: "ADELANTO",
		type: String,
	},
	"VACACIONES TOMADAS": {
		prop: "VACACIONES TOMADAS",
		type: String,
	},
	AGUINALDO: {
		prop: "AGUINALDO",
		type: String,
	},
	TOTAL: {
		prop: "TOTAL",
		type: String,
		required: true,
	},
};

if (
	getFromLocalStorage("mensuales") != false &&
	getFromLocalStorage.length > 0
) {
	arrayMensuales = getFromLocalStorage("mensuales");
}

const $inputExcelMensuales = document.getElementById("inputExcelMensuales");

const tablaMensuales = $("#tablaMensuales").DataTable({
	data: arrayMensuales,
	select: {
		style: "multi",
		selector: "td:nth-child(13) input",
	},
	order: [[1, "asc"]],
	columns: [
		{ data: "NOMBRE" },
		{ data: "DNI" },
		{ data: "FECHA" },
		{ data: "HABERES MES" },
		{ data: "HORAS EXTRAS" },
		{ data: "FERIADO" },
		{ data: "VACACIONES" },
		{ data: "ALMUERZO" },
		{ data: "ADELANTO" },
		{ data: "VACACIONES TOMADAS" },
		{ data: "AGUINALDO" },
		{ data: "TOTAL" },
		{
			data: null,
			orderable: false,
			defaultContent: "<input type='checkbox' class='select-checkbox'></input>",
		},
		{
			data: null,
			defaultContent:
				"<div><button class='btn-edit btn_mensuales-edit' data-bs-toggle='modal' data-bs-target='#modal_mensuales-edicion'><i class='fa-solid fa-pen-to-square fa-lg  btn_mensuales-edit' style='color: #0b5ed7;'></i></button><button class='btn-delete delete  btn_mensuales-delete'><i class='fa-solid fa-trash fa-lg btn_mensuales-delete' style='color: #dc3545; '></i></button></div>",
			orderable: false,
			width: "250px",
		},
		{ data: "id" },
	],
	columnDefs: [
		{
			targets: [3, 4, 5, 6, 7, 8, 9, 10],
			defaultContent: 0,
			orderable: false,
			render: function (data, type, row) {
				return formatingNumberToMoneda(data);
			},
		},
		{
			targets: 11,
			orderable: false,
			render: function (data, type, row) {
				return formatingNumberToMoneda(data);
			},
		},
	],
	language: {
		processing: "Procesando...",
		lengthMenu: "Mostrar _MENU_ registros",
		zeroRecords: "No se encontraron resultados",
		emptyTable: "Ningún dato disponible en esta tabla",
		infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
		infoFiltered: "(filtrado de un total de _MAX_ registros)",
		search: "Buscar:",
		loadingRecords: "Cargando...",
		paginate: {
			first: "Primero",
			last: "Último",
			next: "Siguiente",
			previous: "Anterior",
		},
		aria: {
			sortAscending: ": Activar para ordenar la columna de manera ascendente",
			sortDescending: ": Activar para ordenar la columna de manera descendente",
		},

		info: "Mostrando _START_ a _END_ de _TOTAL_ registros",

		select: {
			rows: {
				_: "%d filas seleccionadas",
			},
		},
	},
});

export {
	arrayMensuales,
	mensualesSchema,
	$inputExcelMensuales,
	tablaMensuales,
};
