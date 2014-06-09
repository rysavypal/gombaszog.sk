module Jekyll
  class Post
    def initialize(site, source, dir, name)
      @site = site
      @dir = dir
      @base = self.containing_dir(source, dir)
      @name = name

      self.categories = dir.downcase.split('/').reject { |x| x.empty? }
      self.process(name)
      self.read_yaml(@base, name)

      if self.data.has_key?('date')
        self.date = Time.parse(self.data["date"].to_s).localtime # localtime for timezone fix
      end

      #self.published = self.published?

      self.populate_categories
      self.populate_tags
    end
  end
end
