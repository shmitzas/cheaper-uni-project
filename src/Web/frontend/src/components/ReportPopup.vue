<template>
  <div class="container">
    <div
      class="modal fade"
      id="report"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add a movie</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form class="g-3 mt-3" action="/" method="POST">
              <div class="col-12">
                <label for="title" class="form-label">Title</label>
                <input type="text" class="form-control" name="title" value="" />
                <label for="year" class="form-label">Year</label>
                <input type="text" class="form-control" name="year" value="" />
                <label for="rating" class="form-label">Rating</label>
                <input
                  type="text"
                  class="form-control"
                  name="rating"
                  value=""
                />
                <label for="genre" class="form-label">Genres</label>
                <input type="text" class="form-control" name="genre" value="" />
              </div>
              <div class="row mt-5">
                <div class="col-12">
                  <div class="me-2" style="float: left">
                    <input type="hidden" name="action" value="add" />
                    <input type="hidden" name="category" value="movie" />
                    <button
                      type="submit"
                      class="btn btn-success"
                      data-bs-dismiss="modal"
                    >
                      Submit changes
                    </button>
                  </div>
                  <div style="float: left">
                    <input type="hidden" name="action" value="" />
                    <button
                      type="submit"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>