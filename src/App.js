import React, { Component } from "react";
import "./App.css";

export default class App extends Component {
  state = {
    items: JSON.parse(localStorage.getItem("budgetItems")) || [],
    name: "",
    cost: "",
    total: 0,
    isEditing: false,
    currentEditId: null,
    toastMessage: "",
    showToast: false,
  };

  componentDidMount() {
    this.calculateTotal();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  showToast = (message) => {
    this.setState({ toastMessage: message, showToast: true });

    setTimeout(() => {
      this.setState({ showToast: false });
    }, 3000);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, cost, items, isEditing, currentEditId } = this.state;

    if (!name || !cost) return alert("항목 이름과 비용을 입력하세요!");

    if (isEditing) {
      const updatedItems = items.map((item) =>
        item.id === currentEditId ? { ...item, name, cost: parseInt(cost) } : item
      );
      this.setState({ items: updatedItems, isEditing: false, currentEditId: null });
      localStorage.setItem("budgetItems", JSON.stringify(updatedItems));
      this.showToast("아이템이 수정되었습니다!");
    } else {
      const newItem = {
        id: Date.now(),
        name,
        cost: parseInt(cost),
      };
      const newItems = [...items, newItem];
      this.setState({ items: newItems });
      localStorage.setItem("budgetItems", JSON.stringify(newItems));
      this.showToast("아이템이 생성되었습니다!");
    }

    this.setState({ name: "", cost: "" }, this.calculateTotal);
  };

  handleDelete = (id) => {
    const filteredItems = this.state.items.filter((item) => item.id !== id);
    this.setState({ items: filteredItems }, () => {
      localStorage.setItem("budgetItems", JSON.stringify(filteredItems));
      this.calculateTotal();
      this.showToast("아이템이 삭제되었습니다!");
    });
  };

  handleEdit = (id) => {
    const itemToEdit = this.state.items.find((item) => item.id === id);
    this.setState({
      name: itemToEdit.name,
      cost: itemToEdit.cost,
      isEditing: true,
      currentEditId: id,
    });
  };

  handleClearList = () => {
    this.setState({ items: [] }, () => {
      localStorage.setItem("budgetItems", JSON.stringify([]));
      this.calculateTotal();
      this.showToast("모든 아이템이 삭제되었습니다!");
    });
  };

  calculateTotal = () => {
    const total = this.state.items.reduce((sum, item) => sum + item.cost, 0);
    this.setState({ total });
  };

  render() {
    const { items, name, cost, total, isEditing, toastMessage, showToast } = this.state;

    return (
      <div className="container">
        <div className="todoBlock">
          <div className={`toste_message ${showToast ? "show" : ""}`}>
            <p>{toastMessage}</p>
          </div>
          <div className="title">
            <h1>예산 계산기</h1>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="wrap">
              <div className="left">
                <p>지출 항목</p>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                  placeholder="예)렌트비"
                />
              </div>
              <div className="right">
                <p>비용</p>
                <input
                  type="number"
                  name="cost"
                  min="0"
                  value={cost}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <button type="submit" className="modify">
              {isEditing ? "수정 완료" : "추가"}
            </button>
          </form>
          <div className="list">
            {items.map((item) => (
              <div className="list_count" key={item.id}>
                <p>{item.name}</p>
                <p>{item.cost}원</p>
                <button
                  className="list_modify"
                  onClick={() => this.handleEdit(item.id)}
                >
                  수정
                </button>
                <button
                  className="list_delete"
                  onClick={() => this.handleDelete(item.id)}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
          <button
            className="list_detail_delete"
            onClick={this.handleClearList}
          >
            목록 지우기
          </button>
        </div>
        <h3>총지출: {total}원</h3>
      </div>
    );
  }
}
