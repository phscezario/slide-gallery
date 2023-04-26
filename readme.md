<h1>Galeria Rolante</h1>

<a href="https://phscezario.github.io/slide-gallery/">Veja aqui</a>

## Como usar:

### Na DIV pai

Colocar a classe: "my-slider-gallery" e os atributo `"data-height" (altura)`, `"data-spacing" (espaços entre elementos)` e `"data-show" (quantos elementos vão aparecer)` funcionam melhor se configura-los, porém eles possuem um valor padrão.

-   _data-height_ pega a altura real do primeiro item filho da galeria e padroniza para os outros.
-   _data-spacing_ Valor padrão 10.
-   _data-show_ Valor padrão 4.

### Outros atributos e suas funções:

-   _data-autoplay="yes"_ define se a galeria vai se mover automaticamente.
-   _data-timeplay="3"_ define tempo em segundos para executar o "autoplay", pode ser usado com valor decimal.

### Responsividade

Cada galeria pode possuir atributos para tamanhos de telas especificas, esses atributos podem ser usados em conjunto para uma melhor responsividade da sua galeria.

#### Telas iguais ou maiores que 1024px

-   _data-lg-show_ Definem itens que apareceram em resolução menor ou igual a 1024px.
-   _data-lg-spacing_ Define espaços entre os itens em resolução menor ou igual a 1024px.
-   _data-lg-height_ Define altura da galeria em resolução menor ou igual a 1024px.

#### Telas iguais ou maiores que 768px

-   _data-md-show_ Definem itens que apareceram em resolução menor ou igual a 768px.
-   _data-md-spacing_ Define espaços entre os itens em resolução menor ou igual a 768px.
-   _data-md-height_ Define altura da galeria em resolução menor ou igual a 768px.

#### Telas iguais ou maiores que 414px

-   _data-sm-show_ Definem itens que apareceram em resolução menor ou igual a 414px.
-   _data-sm-spacing_ Define espaços entre os itens em resolução menor ou igual a 414px.
-   _data-sm-height_ Define altura da galeria em resolução menor ou igual a 414px.

### Nas DIVs filhos

Cada filho deve ser definido com a classe "item" Ex.: `<div class="item">`.

Qualquer conteúdo pode ser adicionado dentro da DIV filha.
