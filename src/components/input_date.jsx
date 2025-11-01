import React from "react";

class InputDate extends React.Component {
  constructor(props) {
    super(props);
    this.buildDate = this.buildDate.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.setLabelActive = this.setLabelActive.bind(this);
    this.modelId = this.modelId.bind(this);
  }

  componentDidMount() {
    const id = this.modelId();
    const help_year = this.props.help_year;
    const inputChange = this.inputChange;

    if (help_year) {
      $(`#${id}`).attr({ "data-min-year": "1950" });
    } else {
      $(`#${id}`).attr({ "data-min-year": "2016" });
    }

    $(`#${id}`).dateDropper().on("change", function (ev) {
      const val = $(this).val();
      inputChange(val);
    });

    const today = new Date().setHours(0, 0, 0, 0);
    const d1 = new Date($(`#${id}`).val()).setHours(0, 0, 0, 0);
    if (!this.props.data_date["data-default-date"]) {
      $(`#${id}`).val("");
    }
    if (help_year) {
      // I need to modify the DOM with JQuery because I am using a library for the dates
      $(".appended").remove();
      // eslint-disable-next-line xss/no-mixed-html
      $(".pick-y .pick-sl").parent().after("<p class='appended append-inactive' style='text-align:center;font-size:12px;'>10 years leaps - inactive</p>");
      $(".pick-y .pick-sl").on("click", function () {
        let state_info = "active";
        if ($(".append-active").length) {
          state_info = "inactive";
        }
        $(".appended").remove();
        // eslint-disable-next-line xss/no-mixed-html
        $(this).parent().after(`<p class='appended append-active' style='text-align:center;font-size:12px;'>10 years leaps - ${state_info}</p>`);
      });
    }
    this.setLabelActive(id);
  }

  inputChange(val) {
    this.setLabelActive(this.modelId());

    if (this.props.handleInputChange) {
      this.props.handleInputChange(val, this.modelId());
    }
  }

  setLabelActive(id) {
    const picker_input = $(`#${id}`);
    const picker_label = picker_input.closest(".md-form").find("label");
    if (picker_input.val() === "") {
      picker_label.removeClass("active");
    } else if (!picker_label.hasClass("active")) {
      picker_label.addClass("active");
    }
  }

  modelId() {
    const object_id = this.props.fallback_id;
    if (object_id != null) {
      return `${this.props.model_name}_${this.props.name}_${object_id}`;
    }
    return this.props.name;
  }

  modelName() {
    const object_name = this.props.nested_model_name;
    if (object_name != null) {
      return object_name;
    }
    return `${this.props.model_name}[${this.props.name}]`;
  }

  buildDate() {
    const data_set = this.props.data_date;

    if (this.props.model[this.props.name]) {
      const date = new Date(this.props.model[this.props.name]);
      data_set["data-default-date"] = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
      data_set["data-max-year"] = `${date.getFullYear() + 2}`;
    } else if (this.props.default_date) {
      const date = new Date(this.props.default_date);
      data_set["data-default-date"] = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
      data_set["data-max-year"] = `${date.getFullYear() + 2}`;
    } else {
      data_set["data-max-year"] = "2030";
    }
    return (
      <input id={this.modelId()} className='form-control' type="text" {...data_set} disabled={this.props.readonly} onChange={this.inputChange} name={this.modelName()}/>
    );
  }

  render() {
    return (
      <div className="">
        {this.buildDate()}
      </div>
    );
  }
}

export default InputDate;
