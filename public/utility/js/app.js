const mode_selection = document.querySelector(".mode-selection");
const textarea_data_input = document.querySelector("#data-input-area");
const placeholder = `Moshe Chung, Desiree Ramirez, Turner Erickson, Alayna Sandoval, Jakayla Frederick,
Rashad Werner,
Neveah Cardenas,
Quinn Myers,
Keenan Wong,
Grace Bentley,
Clare Montoya`;
textarea_data_input.placeholder = placeholder;

const caption_input = document.querySelector(".caption-input");
const member_count_input = document.querySelector(".member-count-input");
const data_counter_area = document.querySelector(".data-counter-area");
const shuffle_counter_area = document.querySelector(".shuffle-counter-area");
const shuffle_btn = document.querySelector(".shuffle-btn");
const guide_list = document
  .querySelector(".guide-area")
  .getElementsByTagName("li");
const table_caption = document.getElementsByTagName("caption")[0];
const copy_btn = document.querySelector(".copy-btn");
const table_body = document.querySelector(".table-body");
const text_field = document.querySelector(".text-field");
const modal_text_area = document.querySelector("#modal-text-area");

mode_selection.addEventListener("input", function () {
  disabledEnabledShuffleBtn();
  change_mode(this.value);
});

function change_mode(mode) {
  const special_container = document.querySelectorAll(".special-container");
  special_container.forEach((c) => c.classList.add("show-special-container"));

  const mode_display_area = document.querySelector(".mode-display-area");
  const number_input_title = document.querySelector(".number-input-title");
  const col_one_table_title = document.querySelector(".col-one-table-title");
  const col_two_table_title = document.querySelector(".col-two-table-title")
    .childNodes[0];

  data_counter_area.innerHTML = 0;
  shuffle_counter_area.innerHTML = 0;
  table_caption.innerHTML = "Ini adalah caption tabel";
  table_body.innerHTML = "";

  textarea_data_input.value = "";
  caption_input.value = "";
  member_count_input.value = "";
  disabledEnabledShuffleBtn();
  mode_display_area.innerHTML = mode;
  if (mode == "Pengacakan & Pembagian Anggota Kelompok") {
    number_input_title.innerHTML = "Masukan jumlah anggota tiap kelompok :";
    col_one_table_title.innerHTML = "Kelompok";
    col_two_table_title.nodeValue = "Anggota";
  } else if (mode == "Pengacakan Serta Menyeleksi Data") {
    number_input_title.innerHTML =
      "Masukan jumlah hasil data yang di seleksi :";
    col_one_table_title.innerHTML = "Data";
    col_two_table_title.nodeValue = "Hasil";
  }

  console.log(guide_list.length);
  for (let i = 1; i < guide_list.length; i++) {
    guide_list[i].style.display = "block";
  }
}

textarea_data_input.addEventListener("input", function () {
  let counter = (this.value.match(/,/g) || []).length;
  data_counter_area.innerHTML = counter + 1;
  shuffle_counter_area.innerHTML = 0;
  disabledEnabledShuffleBtn();
  shuffle_count = 0;

  if (this.value.length > 0) {
    guide_list[1].style.display = "none";
  } else {
    guide_list[1].style.display = "block";
  }
});

caption_input.addEventListener("input", function () {
  if (this.value.length > 0) {
    table_caption.innerHTML = this.value;
  } else {
    table_caption.innerHTML = "Ini adalah caption tabel";
  }
  disabledEnabledShuffleBtn();

  if (this.value.length > 0) {
    guide_list[2].style.display = "none";
  } else {
    guide_list[2].style.display = "block";
  }
});

member_count_input.addEventListener("input", function () {
  disabledEnabledShuffleBtn();

  if (this.value > 0) {
    guide_list[3].style.display = "none";
  } else {
    guide_list[3].style.display = "block";
  }
});

let shuffle_count = 0;
shuffle_btn.addEventListener("click", () => {
  table_body.innerHTML = "";
  const data = textarea_data_input.value.split(",");
  let sorted_data;
  for (let i = 0; i < 10000; i++) {
    sorted_data = data.sort(() => Math.random() - 0.5);
  }
  split(sorted_data);

  shuffle_count++;
  shuffle_counter_area.innerHTML = shuffle_count;
});

function split(sorted_data) {
  let result = function () {
    if (mode_selection.value == "Pengacakan & Pembagian Anggota Kelompok") {
      return sorted_data.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / member_count_input.value);

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []; // start a new chunk
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
      }, []);
    } else {
      return sorted_data.slice(0, member_count_input.value).map((d) => [d]);
    }
  };

  display_data(result());
}

function display_data(result) {
  const data_result = result
    .map((data, i) => {
      return `<tr>
    <th scope="row" class="kelompok-cell">${i + 1}</th>
    <td>
      ${data.join(", ")}
    </td>
  </tr>`;
    })
    .join("");

  table_body.innerHTML = data_result;

  copy_data(result);
}

function copy_data(result) {
  const data = result
    .map(
      (data, i) =>
        `${
          mode_selection.value == "Pengacakan & Pembagian Anggota Kelompok"
            ? `Kelompok`
            : `Data`
        } ${i + 1} <br> - ${data.join("<br/>- ")}<br/><br/>`
    )
    .join("");
  text_field.innerHTML = `${caption_input.value} <br/> <br/> ${data}`;
  modal_text_area.value = text_field.innerText;
}

const modal_copy_btn = document.querySelector(".modal-copy-btn");
modal_copy_btn.addEventListener("click", function () {
  modal_text_area.focus();
  modal_text_area.select();
  document.execCommand("copy");
  alert("Data berhasil dicopy ke clipboard");
});

shuffle_btn.disabled = true;
copy_btn.disabled = true;

function disabledEnabledShuffleBtn() {
  if (mode_selection.value != "-") {
    if (textarea_data_input.value.length > 0) {
      if (caption_input.value.length > 0) {
        if (member_count_input.value > 0) {
          shuffle_btn.disabled = false;
          copy_btn.disabled = false;
        } else {
          shuffle_btn.disabled = true;
          copy_btn.disabled = true;
        }
      } else {
        shuffle_btn.disabled = true;
        copy_btn.disabled = true;
      }
    } else {
      shuffle_btn.disabled = true;
      copy_btn.disabled = true;
    }
  } else {
    shuffle_btn.disabled = true;
    copy_btn.disabled = true;
  }
}

/*Moshe Chung,
Desiree Ramirez,
Turner Erickson,
Alayna Sandoval,
Jakayla Frederick,
Kimberly Andrade,
Johnathon Sweeney,
Lucille Esparza,
Prince King,
Athena Miller,
Aaden Mueller,
Jude Joseph,
Rashad Werner,
Neveah Cardenas,
Quinn Myers,
Keenan Wong,
Grace Bentley,
Clare Montoya,
Jovanny Adams,
Gunner Blackwell,
Kareem Macias,
Reese Moreno,
Iliana Ferrell,
Brianna Robertson,
Naima Middleton,
Jasmin Stone,
Andrew Stephens,
Patience Hale,
Jordan Camacho,
Jaslene Hogan*/
