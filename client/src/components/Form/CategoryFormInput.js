import React from 'react'

const CategoryForm = ({handleSubmit,value,setValue}) => {
    //we have passed props and now we will call this as <categoryForm/> rout in createCategory
    //page
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  )
}

export default CategoryForm
