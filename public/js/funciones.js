let uniqueIdCounter = 0;

function saveInLocalStorage(array, name) {
	localStorage.setItem(name, JSON.stringify(array));
}

function getFromLocalStorage(name) {
	return JSON.parse(localStorage.getItem(name));
}

function readExcel(input, schema) {
	return readXlsxFile(input.files[input.files.length - 1], {
		schema,
		dateFormat: "mm/dd/yyyy",
		includeNullValues: true,
		transformData(data) {
			return data.filter(
				row => row.filter(column => column !== null).length > 0
			);
		},
	}).then(({ rows, errors }) => {
		if (errors.length > 0) {
			console.error(errors);
			return false;
		}
		return rows;
	});
}

async function checkInputExcel(input, schema, array, table) {
	array = await readExcel(input, schema);
	if (array === false) {
		document.querySelector(".error-section").hidden = false;
	} else {
		document.querySelector(".error-section").hidden = true;
		array.map(e => {
			e.NOMBRE ? (e.NOMBRE = formatedCase(e.NOMBRE)) : "";
			e.FECHA = convertToDate(e.FECHA);
			e.id = generateRandomId();
		});

		if (array[0].hasOwnProperty("NOMBRE")) {
			saveInLocalStorage(array, "jornales");
		} else {
			saveInLocalStorage(array, "proveedores");
		}
	}
	if (table) {
		table.clear();
		table.rows.add(array);
		table.draw();
	}
}

async function checkInputExcelMensuales(input, schema, array, table) {
	array = await readExcel(input, schema);
	if (array === false) {
		document.getElementById("alert").hidden = false;
	} else {
		document.getElementById("alert").hidden = true;
		array.map(e => {
			e.FECHA = convertToDate(e.FECHA);
			e.id = generateRandomId();
		});
		saveInLocalStorage(array, "mensuales");
	}
	if (table) {
		table.clear();
		table.rows.add(array);
		table.draw();
	}
}

function generateRandomId() {
	const id = crypto.randomUUID();
	return id;
}

function editRow(event) {
	let fila = event.target.closest("tr");
	let id = event.target.closest("tr").lastElementChild.textContent;
	const values = Object.values(
		getFromLocalStorage("mensuales").find(e => e.id === id)
	);
	let rowIndex = fila.rowIndex;
	document.querySelector("#modal_mensuales-edicion").showModal();
	let $inputs = document.querySelectorAll("#modal_mensuales-edicion input");
	$inputs.forEach((e, i) => {
		if (e.name === "FECHA") {
			let fecha = values[i].split("/").reverse().join("-");
			e.value = fecha;
		} else {
			e.value = values[i];
		}
	});
	if (getFromLocalStorage("row")) {
		saveInLocalStorage({ id, rowIndex }, "row");
	}
	saveInLocalStorage({ id, rowIndex }, "row");
}

function updatedRow(event, table) {
	let objetoDatos = {};
	let { id, rowIndex } = getFromLocalStorage("row");
	let $inputs =
		event.target.parentElement.previousElementSibling.querySelectorAll("input");
	$inputs.forEach(e => {
		if (e.name === "FECHA") {
			objetoDatos[e.name] = e.value.split("-").reverse().join("/");
		} else {
			objetoDatos[e.name] = e.value;
		}
		//aca debería formatear a moneda los valores
	});
	objetoDatos.id = id;
	const arrayMensuales = getFromLocalStorage("mensuales");
	let index = arrayMensuales.findIndex(e => e.id === id);
	arrayMensuales[index] = objetoDatos;
	saveInLocalStorage(arrayMensuales, "mensuales");
	renderRow(table, id, objetoDatos);
}

function openModal(selector) {
	document.querySelector(selector).showModal();
}

function closeModal(selector) {
	document.querySelector(selector).close();
}

function editRowJornalesProveedores(event, nameTable) {
	let id = event.target.closest("td").nextSibling.textContent;
	let element;
	if (nameTable === "jornales") {
		element = getFromLocalStorage("jornales").find(e => e.id === id);
	} else {
		element = getFromLocalStorage("proveedores").find(e => e.id === id);
	}
	let values = Object.values(element);
	let inputs = document.querySelectorAll(".input-group > input");
	inputs.forEach((e, i) => {
		if (e.name === "FECHA") {
			e.value = String(values[i]).split("/").reverse().join("-");
		} else {
			e.value = values[i];
		}
	});
}

function updateRowJoranlesProveedores(event, table, nameTable) {
	let inputs = document.querySelectorAll("#modal_edicion .input-group > input");
	let id =
		event.target.parentElement.previousElementSibling.firstElementChild
			.lastElementChild.firstElementChild.value;
	let newArray = getFromLocalStorage(nameTable).map(element => {
		if (element.id === id) {
			inputs.forEach(e => {
				if (e.name === "FECHA") {
					element[e.name] = String(e.value).split("-").reverse().join("/");
					return element;
				}
				element[e.name] = e.value;
			});
			return element;
		}
		return element;
	});
	let objeto = newArray.find(e => e.id === id);
	saveInLocalStorage(newArray, nameTable);
	renderRow(table, id, objeto, nameTable);
}

function renderRow(tabla, id, objetoDatos, categoria = "mensuales") {
	let index;

	tabla.rows().every(function (rowIdx, tableLoop, rowLoop) {
		if (this.data().id === id) {
			index = rowIdx;
		}
	});

	if (categoria === "mensuales") {
		for (let propiedad in objetoDatos) {
			if (objetoDatos[propiedad] === null || objetoDatos[propiedad] === "") {
				objetoDatos[propiedad] = 0;
			}
		}
	}

	tabla.row(index).data(objetoDatos).draw();
}

function addRow(table, nameTable) {
	const newRow = {};
	const $inputs = document.querySelectorAll(".modal-edit input");
	$inputs.forEach(e => {
		if (e.name === "FECHA") {
			newRow[e.name] = e.value.split("-").reverse().join("/");
		} else {
			newRow[e.name] = e.value;
		}
	});
	newRow.id = generateRandomId();
	const array = getFromLocalStorage(nameTable);
	array.push(newRow);
	saveInLocalStorage(array, nameTable);
	table.row.add(newRow).draw();
}

function deleteAllRows(table, nameTable) {
	const array = getFromLocalStorage(nameTable);
	array.splice(0, array.length);
	saveInLocalStorage(array, nameTable);
	table.clear().draw();
}

function openModalAdd(selector, nameTable = "mensuales") {
	let modal = document.querySelector(selector);
	modal.showModal();
	if (nameTable === "mensuales") {
		modal.querySelector(".btn_modal-guardar").disabled = true;
	}
	const $inputs = modal.querySelectorAll("input");
	$inputs.forEach(e => {
		e.value = "";
	});
}

function convertToDate(date) {
	let dia = date.getUTCDate();
	let mes = date.getUTCMonth() + 1;
	let año = date.getUTCFullYear();

	if (dia < 10) {
		dia = "0" + dia;
	}

	if (mes < 10) {
		mes = "0" + mes;
	}

	let fechaFormateada = `${dia}/${mes}/${año}`;
	return fechaFormateada;
}

function formatingNumberToMoneda(dato) {
	let number = Number(dato) || 0;
	const formatoMoneda = number.toLocaleString("es-AR", {
		style: "currency",
		currency: "ARS",
	});

	return formatoMoneda;
}

function formatingMonedaToNumber(dato) {
	let number = dato.replace(/[^\d.,-]/g, "");
	number = parseFloat(limpio.replace(",", "."));

	return number;
}

function totalSum(tabla, event) {
	let inputs = [...event.target.closest("form").querySelectorAll("input")];
	let arrInputs = inputs.slice(3, 11).map(e => {
		if (!e) {
			return Number((e.value = 0));
		}
		return Number(e.value);
	});
	let total = arrInputs.reduce((acc, cv, index) => {
		let number = cv;
		number ? number : 0;
		if (index >= 4 && index <= 6) {
			acc = acc - number;
		} else {
			acc = acc + number;
		}
		return acc;
	}, 0);
	event.target.closest("form").querySelector("input[name='TOTAL']").value =
		total;
}

function validateEmptyInputMensuales(event, idForm, buttonSelector) {
	let div = event.target.closest("div");
	let span = div.querySelector(".emptyError");
	let button = document.querySelector(buttonSelector);
	if (event.target.value <= 0 || event.target.value == false) {
		div.classList.add("is-invalid");
		span.textContent = `El campo ${event.target.name.toLowerCase()} es obligatorio`;
		span.style.display = "inline";
	} else {
		div.classList.remove("is-invalid");
		div.querySelector(".emptyError").style.display = "none";
	}
	const inputs = document.querySelectorAll(`${idForm} .required`);

	if (
		inputs[0].value != false &&
		(inputs[1].value > 0 || inputs[1].value != false) &&
		inputs[2].value != false
	) {
		button.disabled = false;
	} else {
		button.disabled = true;
	}
}

function removeErrors(idForm) {
	if (document.querySelectorAll(`${idForm} .emptyError`)) {
		document.querySelectorAll(`${idForm} .emptyError`).forEach(e => {
			e.style.display = "none";
		});

		document.querySelectorAll(`${idForm} div`).forEach(e => {
			e.classList.remove("is-invalid");
		});
	}
}

function deleteRow(event, nameTable, table) {
	let id = event.target
		.closest("tr")
		.querySelector("td:last-child").textContent;
	let idxDataTables;
	let array = getFromLocalStorage(nameTable);
	let elementIndex;
	elementIndex = array.findIndex(e => e.id === id);
	array.splice(elementIndex, 1);
	saveInLocalStorage(array, nameTable);
	table.rows().every(function (rowIdx, tableLoop, rowLoop) {
		if (this.data().id === id) {
			idxDataTables = rowIdx;
		}
	});
	table.row(idxDataTables).remove().draw();
}

function selectAllRows(event, tabla) {
	let checkboxes = [...tabla.rows().nodes().to$().find(".select-checkbox")];
	if (event.target.checked) {
		checkboxes.map(e => (e.checked = true));
		tabla.rows().select();
	} else {
		checkboxes.map(e => (e.checked = false));
		tabla.rows().deselect();
	}
}

function updatingStateCheckbox(tabla) {
	let checkboxAll = document.querySelector(".tables_checkbox-all");
	let checkboxes = [...tabla.rows().nodes().to$().find(".select-checkbox")];
	let count = 0;
	checkboxes.map(e => (e.checked ? count++ : ""));
	let totalRows = tabla.rows().count();
	if (count !== totalRows) {
		checkboxAll.checked = false;
	} else {
		checkboxAll.checked = true;
	}
}

function print(table, nameTable) {
	const containerPdfs = document.querySelector(".containerPdfs");
	containerPdfs.innerHTML = "";
	containerPdfs.style.display = "block";

	if (nameTable === "mensuales") {
		generarPdfMensuales(table);
	}

	if (nameTable === "jornales") {
		generarPdfJornales(table);
	}

	if (nameTable === "proveedores") {
		generarPdfProveedores(table);
	}

	const opciones = {
		margin: 5,
		filename: `recibos_${nameTable}.pdf`,
		html2canvas: { scale: 1 },
		jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
	};

	html2pdf()
		.set(opciones)
		.from(containerPdfs)
		.save()
		.catch(err => console.log(err))
		.finally()
		.then(() => (containerPdfs.style.display = "none"));
}

async function generarPdfMensuales(table) {
	const contenidoPdf = document.createDocumentFragment();

	const arrMensuales = table.rows({ selected: true }).data().toArray();

	arrMensuales.map(e => {
		const div = document.createElement("div");
		div.classList.add("container_mensuales-recibo");
		const {
			NOMBRE,
			DNI,
			FECHA,
			"HABERES MES": HABERES_MES,
			"HORAS EXTRAS": HORAS_EXTRAS,
			FERIADO,
			VACACIONES,
			ALMUERZO,
			ADELANTO,
			"VACACIONES TOMADAS": VACACIONES_TOMADAS,
			AGUINALDO,
			TOTAL,
		} = e;
		const innerHtmlRecibo = `
			<div class="cabezera">
				<div>
					<img src="../imagenes/costa_logo.png" alt="" />
				</div>
				<h3>CORTEO S.R.L</h3>
			</div>
			<div class="filasDos">
				<span
					><em
						>EGUIA ZANÓN 9695 - VILLA WARCALDE - CÓRDOBA - 5021 <br />
						CUIT: 30714850748</em
					></span
				>
				<span>Fecha de pago:</span>
				<span>${FECHA}</span>
			</div>
			<div class="filasTres">
				<h4>Apellido y Nombre</h4>
				<h4>DNI</h4>
				<span>${NOMBRE}</span>
				<span>${DNI}</span>
			</div>
			<div class="filasCuatro">
				<span>Concepto</span>
				<span>Valor</span>
				${
					Number(HABERES_MES)
						? `<span>Haberes Mes</span><span>${formatingNumberToMoneda(
								HABERES_MES
						  )}</span>`
						: ""
				}
				${
					Number(HORAS_EXTRAS)
						? `<span>Horas Extras</span><span>${formatingNumberToMoneda(
								HORAS_EXTRAS
						  )}</span>`
						: ""
				}
				${
					Number(AGUINALDO)
						? `<span>Aguinaldo</span><span>${formatingNumberToMoneda(
								AGUINALDO
						  )}</span>`
						: ""
				}
				${
					Number(FERIADO)
						? `<span>Feriado</span><span>${formatingNumberToMoneda(
								FERIADO
						  )}</span>`
						: ""
				}
				${
					Number(VACACIONES)
						? `<span>Vacaciones</span><span>${formatingNumberToMoneda(
								VACACIONES
						  )}</span>`
						: ""
				}
				${
					Number(ALMUERZO)
						? `<span>Almuerzo</span><span>${formatingNumberToMoneda(
								ALMUERZO
						  )}</span>`
						: ""
				}
				${
					Number(ADELANTO)
						? `<span>Adelanto</span><span>${formatingNumberToMoneda(
								ADELANTO
						  )}</span>`
						: ""
				}
				${
					Number(VACACIONES_TOMADAS)
						? `<span>Vacaciones Tomadas</span><span>${formatingNumberToMoneda(
								VACACIONES_TOMADAS
						  )}</span>`
						: ""
				}
			</div>
			<div class="filasCinco">
				<h4>Total Pesos:</h4>
				<h4>${formatingNumberToMoneda(TOTAL)}</h4>
			</div>
			<div class="filasSeis">
				<span>____________________________________</span>
				<span><em>Firma y Aclaración Empleado</em></span>
			</div>
			<div class="filasSiete">
				<img src="../imagenes/costa_logo.png" alt="" />
			</div>
	`;
		div.innerHTML += innerHtmlRecibo;
		contenidoPdf.appendChild(div);
	});

	document.querySelector(".containerPdfs").append(contenidoPdf);
	document.querySelectorAll(".containerPdfs > div:nth-child(2n)").forEach(e => {
		e.classList.add("page-break");
	});
}

async function generarPdfJornales(table) {
	const contenidoPdf = document.createDocumentFragment();

	const arrJornales = table.rows({ selected: true }).data().toArray();

	arrJornales.map(e => {
		const div = document.createElement("div");
		div.classList.add("container_jornales-recibo");

		const {
			NOMBRE,
			DNI,
			FECHA,
			"UNIDAD DE NEGOCIO": UNIDAD_NEGOCIO,
			"HORAS TRABAJADAS": HORAS_TRABAJADAS,
			SUELDO,
		} = e;

		const letrasSueldo = numeroALetras(SUELDO, {
			plural: "PESOS",
			singular: "PESO",
			centPlural: "CENTAVOS",
			centSingular: "CENTAVO",
		});

		const innerHtmlRecibo = `
			<div class="filaUno"><strong>RECIBO DE PAGO</strong></div>
      <div class="filaDos">
        <span>FECHA</span>
        <span>${FECHA ? FECHA : "__________"}</span>
      </div>
      <div class="filaTres">
        <strong>Nombre:</strong> ${NOMBRE ? NOMBRE.toUpperCase() : ""}
      </div>
      <div class="filaCuatro">
        <strong>Recibi de:</strong> CORTEO S.R.L
      </div>
      <div class="filaCinco">
        <strong>La cantidad de:</strong> ${
					SUELDO ? formatingNumberToMoneda(Number(SUELDO)) : ""
				} ${SUELDO ? letrasSueldo : ""}
      </div>
      <div class="filaSeis">
        <strong>Por concepto de:</strong> ${
					UNIDAD_NEGOCIO ? UNIDAD_NEGOCIO : ""
				} ${HORAS_TRABAJADAS ? HORAS_TRABAJADAS + " hs" : ""}
      </div>
      <div class="filaSiete">
        <span>Firma:</span>
        <span>Aclaracion:</span>
        <span>DNI: ${DNI ? DNI : ""}</span>
      </div>
		`;
		div.innerHTML += innerHtmlRecibo;
		contenidoPdf.appendChild(div);
	});

	document.querySelector(".containerPdfs").append(contenidoPdf);
	document.querySelectorAll(".containerPdfs > div:nth-child(4n)").forEach(e => {
		e.classList.add("page-break");
	});
}

async function generarPdfProveedores(table) {
	const contenidoPdf = document.createDocumentFragment();

	const arrJornales = table.rows({ selected: true }).data().toArray();

	arrJornales.map(e => {
		const div = document.createElement("div");
		div.classList.add("container_proveedores-recibo");

		const {
			PROVEEDOR,
			CUIT,
			FECHA,
			COMPROBANTE,
			CONCEPTO,
			"FORMA DE PAGO": FORMA_PAGO,
			MONTO,
		} = e;

		const innerHtmlRecibo = `
			<div class="rowUno">
					<img
						src="../imagenes/costa_logo.png"
						alt=""
					/>
				</div>

				<div class="rowDos">
					<strong>CORTEO S.R.L</strong>
				</div>
				<div class="rowTres">
					<span
						><em
							>EGUIA ZANÓN 9695 - VILLA WARCALDE - CÓRDOBA - 5021 <br />
							CUIT:30714850748</em
						></span
					>
					<span>Fecha de pago:</span>
					<span>${FECHA ? FECHA : ""}</span>
				</div>
				<div class="rowCuatro"><em>PROVEEDOR</em><em>CUIT</em></div>
				<div class="rowCinco">
					<span>${PROVEEDOR ? PROVEEDOR : ""}</span>
					<span>${CUIT ? CUIT : ""}</span>
				</div>
				<div class="rowComprobante">
					<strong><em>COMPROBANTE</em></strong>
					<span>${COMPROBANTE ? COMPROBANTE : ""}</span>
				</div>
				<div class="rowSeis">
					<span>CONCEPTO</span><span>FORMA DE PAGO</span> <span>MONTO</span>
				</div>
				<div class="rowSiete">
					<span>${CONCEPTO ? CONCEPTO : ""}</span>
					<span>${FORMA_PAGO ? FORMA_PAGO : ""}</span>
					<span>${MONTO ? formatingNumberToMoneda(MONTO) : ""}</span>
				</div>
				<div class="rowOcho">
					<strong>TOTAL:</strong> <strong>${
						MONTO ? formatingNumberToMoneda(MONTO) : ""
					}</strong>
				</div>
				<div class="rowNueve">
					________________________________________ <em>Firma y Aclaración</em>
				</div>
		`;
		div.innerHTML += innerHtmlRecibo;
		contenidoPdf.appendChild(div);
	});

	document.querySelector(".containerPdfs").append(contenidoPdf);
	document.querySelectorAll(".containerPdfs > div:nth-child(2n)").forEach(e => {
		e.classList.add("page-break");
	});
}

function disabledPrintButton(id, table) {
	const tabla = table.rows({ selected: true }).data().toArray();
	const button = document.querySelector(`${id}`);
	tabla.length ? (button.disabled = false) : (button.disabled = true);
}

function alertPdfMensuales() {
	document.getElementById("alert").hidden = true;
}

function formatedCase(string) {
	let str = string.toLowerCase();
	return str.replace(/\b\w/g, char => char.toUpperCase());
}

let numeroALetras = (function () {
	function Unidades(num) {
		switch (num) {
			case 1:
				return "UN";
			case 2:
				return "DOS";
			case 3:
				return "TRES";
			case 4:
				return "CUATRO";
			case 5:
				return "CINCO";
			case 6:
				return "SEIS";
			case 7:
				return "SIETE";
			case 8:
				return "OCHO";
			case 9:
				return "NUEVE";
		}

		return "";
	} //Unidades()

	function Decenas(num) {
		let decena = Math.floor(num / 10);
		let unidad = num - decena * 10;

		switch (decena) {
			case 1:
				switch (unidad) {
					case 0:
						return "DIEZ";
					case 1:
						return "ONCE";
					case 2:
						return "DOCE";
					case 3:
						return "TRECE";
					case 4:
						return "CATORCE";
					case 5:
						return "QUINCE";
					default:
						return "DIECI" + Unidades(unidad);
				}
			case 2:
				switch (unidad) {
					case 0:
						return "VEINTE";
					default:
						return "VEINTI" + Unidades(unidad);
				}
			case 3:
				return DecenasY("TREINTA", unidad);
			case 4:
				return DecenasY("CUARENTA", unidad);
			case 5:
				return DecenasY("CINCUENTA", unidad);
			case 6:
				return DecenasY("SESENTA", unidad);
			case 7:
				return DecenasY("SETENTA", unidad);
			case 8:
				return DecenasY("OCHENTA", unidad);
			case 9:
				return DecenasY("NOVENTA", unidad);
			case 0:
				return Unidades(unidad);
		}
	} //Unidades()

	function DecenasY(strSin, numUnidades) {
		if (numUnidades > 0) return strSin + " Y " + Unidades(numUnidades);

		return strSin;
	} //DecenasY()

	function Centenas(num) {
		let centenas = Math.floor(num / 100);
		let decenas = num - centenas * 100;

		switch (centenas) {
			case 1:
				if (decenas > 0) return "CIENTO " + Decenas(decenas);
				return "CIEN";
			case 2:
				return "DOSCIENTOS " + Decenas(decenas);
			case 3:
				return "TRESCIENTOS " + Decenas(decenas);
			case 4:
				return "CUATROCIENTOS " + Decenas(decenas);
			case 5:
				return "QUINIENTOS " + Decenas(decenas);
			case 6:
				return "SEISCIENTOS " + Decenas(decenas);
			case 7:
				return "SETECIENTOS " + Decenas(decenas);
			case 8:
				return "OCHOCIENTOS " + Decenas(decenas);
			case 9:
				return "NOVECIENTOS " + Decenas(decenas);
		}

		return Decenas(decenas);
	} //Centenas()

	function Seccion(num, divisor, strSingular, strPlural) {
		let cientos = Math.floor(num / divisor);
		let resto = num - cientos * divisor;

		let letras = "";

		if (cientos > 0)
			if (cientos > 1) letras = Centenas(cientos) + " " + strPlural;
			else letras = strSingular;

		if (resto > 0) letras += "";

		return letras;
	} //Seccion()

	function Miles(num) {
		let divisor = 1000;
		let cientos = Math.floor(num / divisor);
		let resto = num - cientos * divisor;

		let strMiles = Seccion(num, divisor, "UN MIL", "MIL");
		let strCentenas = Centenas(resto);

		if (strMiles == "") return strCentenas;

		return strMiles + " " + strCentenas;
	} //Miles()

	function Millones(num) {
		let divisor = 1000000;
		let cientos = Math.floor(num / divisor);
		let resto = num - cientos * divisor;

		let strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
		let strMiles = Miles(resto);

		if (strMillones == "") return strMiles;

		return strMillones + " " + strMiles;
	} //Millones()

	return function NumeroALetras(num, currency) {
		currency = currency || {};
		let data = {
			numero: num,
			enteros: Math.floor(num),
			centavos: Math.round(num * 100) - Math.floor(num) * 100,
			letrasCentavos: "",
			letrasMonedaPlural: currency.plural || "PESOS CHILENOS", //'PESOS', 'Dólares', 'Bolívares', 'etcs'
			letrasMonedaSingular: currency.singular || "PESO CHILENO", //'PESO', 'Dólar', 'Bolivar', 'etc'
			letrasMonedaCentavoPlural: currency.centPlural || "CHIQUI PESOS CHILENOS",
			letrasMonedaCentavoSingular:
				currency.centSingular || "CHIQUI PESO CHILENO",
		};

		if (data.centavos > 0) {
			data.letrasCentavos =
				"CON " +
				(function () {
					if (data.centavos == 1)
						return (
							Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular
						);
					else
						return (
							Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural
						);
				})();
		}

		if (data.enteros == 0)
			return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
		if (data.enteros == 1)
			return (
				Millones(data.enteros) +
				" " +
				data.letrasMonedaSingular +
				" " +
				data.letrasCentavos
			);
		else
			return (
				Millones(data.enteros) +
				" " +
				data.letrasMonedaPlural +
				" " +
				data.letrasCentavos
			);
	};
})();

export {
	saveInLocalStorage,
	getFromLocalStorage,
	readExcel,
	generateRandomId,
	editRow,
	editRowJornalesProveedores,
	openModal,
	closeModal,
	updatedRow,
	updateRowJoranlesProveedores,
	addRow,
	convertToDate,
	formatingNumberToMoneda,
	formatingMonedaToNumber,
	validateEmptyInputMensuales,
	totalSum,
	deleteRow,
	print,
	selectAllRows,
	updatingStateCheckbox,
	removeErrors,
	disabledPrintButton,
	alertPdfMensuales,
	formatedCase,
	checkInputExcel,
	checkInputExcelMensuales,
	deleteAllRows,
	openModalAdd,
};
