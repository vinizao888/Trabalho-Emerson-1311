using BibliotecaApi.Models;
using BibliotecaApi.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BibliotecaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MateriaisController : ControllerBase
{
    private readonly IMaterialRepository _repository;

    public MateriaisController(IMaterialRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public ActionResult<IEnumerable<MaterialBiblioteca>> ObterTodos()
    {
        return Ok(_repository.ObterTodos());
    }

    [HttpGet("{id:int}")]
    public ActionResult<MaterialBiblioteca> ObterPorId(int id)
    {
        var material = _repository.ObterPorId(id);

        if (material is null)
            return NotFound(new { mensagem = "Material não encontrado." });

        return Ok(material);
    }

    [HttpPost("livro")]
    public ActionResult<Livro> CadastrarLivro([FromBody] Livro livro)
    {
        var erro = ValidarMaterial(livro);
        if (erro is not null) return BadRequest(new { mensagem = erro });

        if (string.IsNullOrWhiteSpace(livro.Autor))
            return BadRequest(new { mensagem = "O autor é obrigatório." });

        if (livro.Paginas <= 0)
            return BadRequest(new { mensagem = "O número de páginas deve ser maior que zero." });

        var criado = (Livro)_repository.Adicionar(livro);
        return CreatedAtAction(nameof(ObterPorId), new { id = criado.Id }, criado);
    }

    [HttpPost("revista")]
    public ActionResult<Revista> CadastrarRevista([FromBody] Revista revista)
    {
        var erro = ValidarMaterial(revista);
        if (erro is not null) return BadRequest(new { mensagem = erro });

        if (revista.Edicao <= 0)
            return BadRequest(new { mensagem = "A edição deve ser maior que zero." });

        if (revista.MesPublicacao < 1 || revista.MesPublicacao > 12)
            return BadRequest(new { mensagem = "O mês de publicação deve estar entre 1 e 12." });

        var criada = (Revista)_repository.Adicionar(revista);
        return CreatedAtAction(nameof(ObterPorId), new { id = criada.Id }, criada);
    }

    [HttpPut("livro/{id:int}")]
    public IActionResult AtualizarLivro(int id, [FromBody] Livro livro)
    {
        var existente = _repository.ObterPorId(id);
        if (existente is null || existente is not Livro)
            return NotFound(new { mensagem = "Livro não encontrado." });

        var erro = ValidarMaterial(livro);
        if (erro is not null) return BadRequest(new { mensagem = erro });

        if (string.IsNullOrWhiteSpace(livro.Autor))
            return BadRequest(new { mensagem = "O autor é obrigatório." });

        if (livro.Paginas <= 0)
            return BadRequest(new { mensagem = "O número de páginas deve ser maior que zero." });

        _repository.Atualizar(id, livro);
        return Ok(livro);
    }

    [HttpPut("revista/{id:int}")]
    public IActionResult AtualizarRevista(int id, [FromBody] Revista revista)
    {
        var existente = _repository.ObterPorId(id);
        if (existente is null || existente is not Revista)
            return NotFound(new { mensagem = "Revista não encontrada." });

        var erro = ValidarMaterial(revista);
        if (erro is not null) return BadRequest(new { mensagem = erro });

        if (revista.Edicao <= 0)
            return BadRequest(new { mensagem = "A edição deve ser maior que zero." });

        if (revista.MesPublicacao < 1 || revista.MesPublicacao > 12)
            return BadRequest(new { mensagem = "O mês de publicação deve estar entre 1 e 12." });

        _repository.Atualizar(id, revista);
        return Ok(revista);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Remover(int id)
    {
        if (!_repository.Remover(id))
            return NotFound(new { mensagem = "Material não encontrado." });

        return NoContent();
    }

    [HttpGet("{id:int}/descricao")]
    public IActionResult ObterDescricao(int id)
    {
        var material = _repository.ObterPorId(id);

        if (material is null)
            return NotFound(new { mensagem = "Material não encontrado." });

        var tipo = material is Livro ? "Livro" : "Revista";

        return Ok(new
        {
            material.Id,
            tipo,
            descricao = material.Descricao(),
            prazoEmprestimo = material.CalcularPrazo()
        });
    }

    [HttpPost("{id:int}/emprestar")]
    public IActionResult Emprestar(int id)
    {
        var material = _repository.ObterPorId(id);

        if (material is null)
            return NotFound(new { mensagem = "Material não encontrado." });

        if (material is not IEmprestimo emprestimo)
            return BadRequest(new { mensagem = "Este material não possui capacidade de empréstimo." });

        return Ok(new { mensagem = emprestimo.Emprestar() });
    }

    private static string? ValidarMaterial(MaterialBiblioteca material)
    {
        if (string.IsNullOrWhiteSpace(material.Titulo))
            return "O título é obrigatório.";

        if (material.AnoPublicacao < 0)
            return "O ano de publicação não pode ser menor que zero.";

        return null;
    }
}
