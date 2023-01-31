import React from 'react'
import Isbn from './isbnTest'

describe('<Isbn />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Isbn />)
  })
})