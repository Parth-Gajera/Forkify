import icons from 'url:../../img/icons.svg';

export default class View {
  _data;


  render(data,render=true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    // console.log(this._data);
    
    const markup = this._generateMarkup();
  
    if(!render) return markup;
    
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {

    this._data = data;
    const newMarkup = this._generateMarkup();
    // console.log(newMarkup);

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // console.log(newElements);
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements);

    newElements.forEach((newEl,i)=>{
      const curEl = curElements[i];
      // console.log(curEl,newEl.isEqualNode(curEl));

      //Update changes TEXT
      if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !==''){
        curEl.textContent = newEl.textContent;
      }

      //Update change ATRRIBUTES
      if(!newEl.isEqualNode(curEl)){
        // console.log(newEl.attributes);

        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name,attr.value));

      }

    })

  }


  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
           <div class="spinner">
             <svg>
                  <use href="${icons}#icon-loader"></use>
             </svg>
            </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
       <div class="error">
        <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
        </div>
          <p>${message}</p>
    </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
     <div class="message">
      <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
      </div>
        <p>${message}</p>
  </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }

  // addHandelRender(handler) {
  //   ['hashChange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  // }
}
