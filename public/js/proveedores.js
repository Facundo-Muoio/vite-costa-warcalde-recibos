import { getFromLocalStorage, formatingNumberToMoneda } from "./funciones.js";

let arrayProveedores;

const proveedoresSchema = {
	PROVEEDOR: {
		prop: "PROVEEDOR",
		type: String,
	},
	CUIT: {
		prop: "CUIT",
		type: Number,
	},
	FECHA: {
		prop: "FECHA",
		type: Date,
	},
	COMPROBANTE: {
		prop: "COMPROBANTE",
		type: String,
	},
	CONCEPTO: {
		prop: "CONCEPTO",
		type: String,
	},
	"FORMA DE PAGO": {
		prop: "FORMA DE PAGO",
		type: String,
	},
	MONTO: {
		prop: "MONTO",
		type: Number,
	},
};

if (
	getFromLocalStorage("proveedores") != false &&
	getFromLocalStorage.length > 0
) {
	arrayProveedores = getFromLocalStorage("proveedores");
}

const $inputExcelProveedores = document.querySelector("#inputExcelProveedores");

const tableProveedores = new $("#tablaProveedores").DataTable({
	data: arrayProveedores,
	select: {
		style: "multi",
		selector: "td:nth-child(8) input",
	},
	order: [[1, "asc"]],
	columns: [
		{ data: "PROVEEDOR" },
		{ data: "CUIT" },
		{ data: "FECHA" },
		{ data: "COMPROBANTE" },
		{ data: "CONCEPTO" },
		{ data: "FORMA DE PAGO" },
		{ data: "MONTO" },
		{
			data: null,
			defaultContent: "<input type='checkbox' class='select-checkbox'></input>",
		},
		{
			data: null,
			defaultContent: `
			<div id="acciones_proveedores">
					<button class="btn-edit btn_proveedores-edit">
						<i
							class="fa-solid fa-pen-to-square fa-xl btn_proveedores-edit"
							style="color: #0b5ed7;"
						></i>
					</button>
					<button class="btn-delete btn_proveedores-delete">
						<i class="fa-solid fa-trash fa-xl btn_proveedores-delete" style="color: #dc3545"></i>
					</button>
				</div>`,
		},
		{ data: "id", orderable: false },
	],
	columnDefs: [
		{ target: [2, 3, 4, 5, 6, 7, 8], orderable: false },
		{
			target: 2,
			render: function (data) {
				return data.split("-").reverse().join("/");
			},
		},
		{
			target: 6,
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
	arrayProveedores,
	proveedoresSchema,
	$inputExcelProveedores,
	tableProveedores,
};
