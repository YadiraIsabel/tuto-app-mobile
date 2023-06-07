
class Noticia {
    constructor(data, id) {
        this.id = id;
        this.nombre = data.name;
        this.descripcion = data.description;
        this.autor = data.creator;
        this.fechaPublicacion = data.created_at;
    }
}
export default Noticia;
